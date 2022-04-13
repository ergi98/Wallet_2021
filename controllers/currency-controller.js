// Puppeteer
import puppeteer from "puppeteer";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";

async function getCurrencyRates(req, res) {
	try {
		const currencies = await CurrencySchema.aggregate([
			{
				$set: {
					rateForALL: { $ifNull: [{ $toDouble: "$rateForALL" }, 1] },
				},
			},
		]);
		res.status(200).send(currencies);
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	}
}

async function fetchRatesWithPuppeteer() {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(
		"https://www.bankofalbania.org/Tregjet/Kursi_zyrtar_i_kembimit/"
	);
	await page.waitForSelector(".table");

	const rates = await page.evaluate(() => {
		const extractCurrencyTable = (tableCollection) => {
			if (!tableCollection) return;
			for (let table of tableCollection) {
				if (!table.children || !table.children[0] || !table.children[1])
					continue;
				if (table.children[0].innerText.includes("Monedha Kryesore"))
					return table.children[1];
			}
		};

		const extractCurrencyRates = (tableBody) => {
			let arr = [];
			if (!tableBody || !tableBody.children) return arr;
			let rateRegex = new RegExp(/^[0-9]*[.]{1}[0-9]*$/);
			for (let tr of tableBody.children) {
				if (!tr.children || tr.children?.length < 3) continue;

				let acronym = tr.children[1]?.innerText ?? "";
				let rate = tr.children[2]?.innerText ?? "";
				let parsedRate = parseFloat(rate);

				if (acronym && !isNaN(parsedRate) && rateRegex.test(rate))
					arr.push({
						acronym,
						rateForALL: parsedRate,
					});
			}
			return arr;
		};

		let allTables = document.querySelectorAll(".table");
		let currencyTable = extractCurrencyTable(allTables);
		if (!currencyTable) throw new Error("Table not found");
		let results = extractCurrencyRates(currencyTable);
		if (results.length === 0)
			throw new Error("Could not extract currency data");
		return results;
	});

	return rates;
}

async function populateRatesFromBOA(req, res) {
	try {
		const currencies = await CurrencySchema.find({});

		let availableCurrencies = currencies.map((currency) => currency.acronym);

		const fetchedRates = await fetchRatesWithPuppeteer();

		if (!Array.isArray(fetchedRates) || fetchedRates?.length === 0)
			throw new Error("Could not extract currency rates.");

		const filteredRates = fetchedRates.filter((rate) =>
			availableCurrencies.includes(rate.acronym)
		);

		if (!Array.isArray(filteredRates) || filteredRates?.length === 0)
			throw new Error(
				"Currency data does not include any currency we store in DB."
			);

		const bulkUpdateArray = [];

		let updatedAt = new Date();

		for (let rate of filteredRates) {
			bulkUpdateArray.push({
				updateOne: {
					filter: { acronym: rate.acronym },
					update: { rateForALL: rate.rateForALL, updatedAt: updatedAt },
				},
			});
		}

		let result = await CurrencySchema.bulkWrite(bulkUpdateArray);

		res.status(200).send(result);
	} catch (err) {
		console.error(err);
		res.status(400).send({
			message:
				err.details?.message ||
				err.message ||
				"An error occurred. Please try again.",
		});
	}
}

export { getCurrencyRates, populateRatesFromBOA };
