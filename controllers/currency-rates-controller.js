import mongoose from "mongoose";

// Puppeteer
import puppeteer from "puppeteer";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";
import CurrencyRatesSchema from "../schemas/currency-rates-schema.js";

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

		let availableCurrencies = {};

		for (let currency of currencies) {
			availableCurrencies[currency.acronym] = currency._id;
		}

		const fetchedRates = await fetchRatesWithPuppeteer();

		if (!Array.isArray(fetchedRates) || fetchedRates?.length === 0)
			throw new Error("Could not extract currency rates.");

		const filteredRates = fetchedRates.filter(
			(rate) => availableCurrencies[rate.acronym] !== undefined
		);

		if (!Array.isArray(filteredRates) || filteredRates?.length === 0)
			throw new Error(
				"Currency data does not include any currency we store in DB."
			);

		let createdAt = new Date();

		let startOfDay = new Date(createdAt.setUTCHours(0, 0, 0, 0));
		let endOfDay = new Date(createdAt.setUTCHours(23, 59, 59, 999));

		let latestStoredRates = await CurrencyRatesSchema.find({
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});

		// First time inserting these rates for today
		if (latestStoredRates.length === 0) {
			const currencyRatesArray = [
				{
					createdAt,
					rateForALL: 1,
					currency: mongoose.Types.ObjectId(availableCurrencies["ALL"]),
				},
			];
			for (let rate of filteredRates) {
				let currencyId = availableCurrencies[rate.acronym];
				if (!currencyId)
					throw new Error("Something went wrong when fetching currency rates");
				currencyRatesArray.push({
					createdAt,
					rateForALL: rate.rateForALL,
					currency: mongoose.Types.ObjectId(currencyId),
				});
			}

			// Not all currencies have been updated
			if (currencyRatesArray.length !== currencies.length)
				throw new Error("Could not fetch data for all the needed currencies");

			await CurrencyRatesSchema.insertMany(currencyRatesArray);
		}
		// Called later on the same day - Just update
		else {
			const bulkUpdateArray = [];
			for (let rate of filteredRates) {
				let currencyId = availableCurrencies[rate.acronym];
				if (!currencyId)
					throw new Error("Something went wrong when fetching currency rates");
				bulkUpdateArray.push({
					updateOne: {
						filter: { _id: mongoose.Types.ObjectId(currencyId) },
						update: { rateForALL: rate.rateForALL },
					},
				});
			}

			// Not all currencies have been updated
			// No need to update ALL - ALL
			if (bulkUpdateArray.length !== currencies.length - 1)
				throw new Error("Could not fetch data for all the needed currencies");

			await CurrencyRatesSchema.bulkWrite(bulkUpdateArray);
		}

		res.status(200).send({ success: true });
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

export { populateRatesFromBOA };
