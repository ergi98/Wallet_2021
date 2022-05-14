// This file serves to enter mock data in order to test application features during development
import {
	user,
	sources,
	categories,
	portfolios,
	transactions,
} from "./mock-data.js";

import axios from "axios";

const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: "http://localhost:3001/",
	headers: {
		"Content-Type": "application/json",
	},
});

async function fillMockData() {
	try {
		// Creating user
		const data = await axiosInstance.post("/auth/sign-up", user);
		axiosInstance.defaults.headers[
			"Authorization"
		] = `Bearer ${data.data.token}`;

		// Creating sources
		const reqArray = [];
		for (const source of sources)
			reqArray.push(axiosInstance.post("/source/create", source));

		// Creating categories
		for (const category of categories)
			reqArray.push(axiosInstance.post("/category/create", category));

		// Creating portfolios
		for (const portfolio of portfolios)
			reqArray.push(axiosInstance.post("/portfolio/create", portfolio));

		const promiseRes = await Promise.all(reqArray);

		const promiseData = promiseRes.map((res) => res.data);

		// Creating transactions
		for (const [index, transaction] of transactions.entries()) {
			const hrs = getRandom(0, 23);
			const mins = getRandom(0, 59);
			const date = new Date(
				transaction.year,
				transaction.month,
				transaction.day,
				hrs,
				mins
			);

			const portId = promiseData.find(
				(res) => res.description === transaction.portfolio
			)?._id;
			if (!portId) throw new Error("Smth wrong with portfolio res");

			const srcId = promiseData.find(
				(res) => res.name === transaction.source
			)?._id;
			if (!srcId) throw new Error("Smth wrong with sources res");

			const catId = promiseData.find(
				(res) => res.name === transaction.category
			)?._id;
			if (!catId) throw new Error("Smth wrong with category res");

			const formattedTransaction = {
				date: date,
				portfolio: portId,
				type: transaction.type,
				amount: transaction.amount,
				currency: transaction.currency,
				description: `Transaction ${index}`,
			};

			// Earning Transaction
			if (transaction.source) {
				formattedTransaction["source"] = srcId;
				await axiosInstance.post("/transaction/earning", formattedTransaction);
			}
			// Expense Transaction
			else if (transaction.category) {
				formattedTransaction["category"] = catId;
				await axiosInstance.post("/transaction/expense", formattedTransaction);
			}
		}

		console.log("Done");
	} catch (err) {
		console.log(err);
		console.log("An error occurred");
	}
}

const getRandom = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

await fillMockData();
