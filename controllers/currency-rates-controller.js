import mongoose from "mongoose";

// Puppeteer
import puppeteer from "puppeteer";

// Big Number
import BigNumber from "bignumber.js";

// Schema
import CurrencySchema from "../schemas/currency-schema.js";
import CurrencyRatesSchema from "../schemas/currency-rates-schema.js";

// Fetch
import fetch, { Headers } from "node-fetch";

// Last fallback
const hardcodedRates = {
	ALL: 1,
	USD: 112.8,
	EUR: 120.94,
	GBP: 142.15,
	AUD: 80.56,
	CAD: 88.56,
	CHF: 117.63,
};

const compareIds = (id1, id2) =>
	mongoose.Types.ObjectId(id1).equals(mongoose.Types.ObjectId(id2));

BigNumber.set({ DECIMAL_PLACES: 4, ROUNDING_MODE: 4 });

function getRatesFromLatestStored(currencies, latestRates) {
	const rates = [];
	const ALL_CURRENCY = currencies.find(
		(currency) => currency.acronym === "ALL"
	);
	// For each currency
	for (const currency of currencies) {
		if (currency.acronym === "ALL") continue;
		// Find the latest rate to ALL
		const latestCurrencyRates = latestRates.find((doc) =>
			compareIds(doc.currency, currency._id)
		);
		let rate;
		if (latestCurrencyRates) {
			const rateToALL = latestCurrencyRates.rates.find((rate) =>
				compareIds(rate._id, ALL_CURRENCY._id)
			);
			rate = rateToALL?.rate ?? hardcodedRates[currency.acronym];
		}
		// If for whatever reason we do not have any entry fallback to hardcoded values
		else rate = hardcodedRates[currency.acronym];
		rates.push({
			acronym: currency.acronym,
			rateToALL: new BigNumber(rate).toNumber(),
		});
	}
	return rates;
}

async function fetchRatesWithPuppeteer() {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(process.env.RATES_URL);
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

async function fetchRatesWithExchangeAPI(currencies) {
	const requestHeaders = new Headers();
	requestHeaders.append("apikey", process.env.EXCHANGE_API_KEY);
	const requestOptions = {
		method: "GET",
		redirect: "follow",
		headers: requestHeaders,
	};
	const base = "ALL";
	const symbols = currencies
		.map((currency) => currency.acronym)
		.filter((currency) => currency !== "ALL");
	const response = await fetch(
		`https://api.apilayer.com/exchangerates_data/latest?symbols=${symbols}&base=${base}`,
		requestOptions
	);
	const data = await response.json();

	const rates = [];

	const one = new BigNumber("1");

	// Transforming in the same format that puppeteer returns data;
	for (const key of Object.keys(data.rates)) {
		const rate = new BigNumber(data.rates[key].toString());
		const obj = {
			acronym: key,
			rateForALL: one.dividedBy(rate).toNumber(),
		};
		rates.push(obj);
	}
	return rates;
}

async function populateRatesFromBOA(req, res) {
	try {
		const createdAt = new Date();

		const startOfDay = new Date(createdAt.setUTCHours(0, 0, 0, 0));
		const endOfDay = new Date(createdAt.setUTCHours(23, 59, 59, 999));

		const [currencies, latestStoredRates] = await Promise.all([
			CurrencySchema.find({}),
			CurrencyRatesSchema.find({
				createdAt: {
					$gte: startOfDay,
					$lte: endOfDay,
				},
			}),
		]);

		const availableCurrencies = {};

		// Creating a acronym -> id object
		for (const currency of currencies) {
			availableCurrencies[currency.acronym] = currency._id;
		}

		let fetchedRates;

		// Try to get rates with puppeteer
		try {
			fetchedRates = await fetchRatesWithPuppeteer();
		} catch (err) {
			// If that fails try to fetch rates with exchange api
			try {
				fetchedRates = await fetchRatesWithExchangeAPI(currencies);
			} catch (err) {
				// If that fails fallback to latest successfully fetched rates (or at the very end hardcoded values)
				fetchedRates = getRatesFromLatestStored(currencies, latestStoredRates);
			}
		}

		if (!Array.isArray(fetchedRates) || fetchedRates?.length === 0)
			throw new Error("Could not extract currency rates.");

		// Filtering the rates to only the ones we are interested in
		const filteredRates = fetchedRates.filter(
			(rate) => availableCurrencies[rate.acronym] !== undefined
		);

		// If there are missing data or no data at all throw
		if (!Array.isArray(filteredRates) || filteredRates?.length === 0)
			throw new Error(
				"Currency data does not include any currency we store in DB."
			);
		else if (filteredRates.length !== currencies.length - 1)
			throw new Error("Could not fetch data for all the needed currencies");

		// ALL -> ALL is always 1
		filteredRates.push({
			acronym: "ALL",
			rateForALL: 1,
		});

		// Calculating rates for each currency to each currency
		for (const fromEntry of filteredRates) {
			for (const toEntry of filteredRates) {
				const fromRateToALL = new BigNumber(fromEntry.rateForALL);
				const toRateToALL = new BigNumber(toEntry.rateForALL);
				if (fromEntry.rates === undefined) {
					fromEntry.rates = [
						{
							_id: mongoose.Types.ObjectId(
								availableCurrencies[toEntry.acronym]
							),
							acronym: toEntry.acronym,
							rate: fromRateToALL.dividedBy(toRateToALL).toString(),
						},
					];
				} else {
					fromEntry.rates.push({
						_id: mongoose.Types.ObjectId(availableCurrencies[toEntry.acronym]),
						acronym: toEntry.acronym,
						rate: fromRateToALL.dividedBy(toRateToALL).toString(),
					});
				}
			}
		}

		// First time inserting these rates for today
		if (latestStoredRates.length === 0) {
			const currencyRatesArray = [];
			for (let rate of filteredRates) {
				let currencyId = availableCurrencies[rate.acronym];
				if (!currencyId)
					throw new Error("Something went wrong when fetching currency rates");
				currencyRatesArray.push({
					createdAt,
					rates: rate.rates,
					currency: mongoose.Types.ObjectId(currencyId),
				});
			}
			await CurrencyRatesSchema.insertMany(currencyRatesArray);
		}
		// Called later on the same day - Just update
		else {
			const bulkUpdateArray = [];
			for (const rate of filteredRates) {
				let currencyId = availableCurrencies[rate.acronym];
				if (!currencyId)
					throw new Error("Something went wrong when fetching currency rates");
				bulkUpdateArray.push({
					updateOne: {
						filter: { _id: mongoose.Types.ObjectId(currencyId) },
						update: { rates: rate.rates },
					},
				});
			}
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
