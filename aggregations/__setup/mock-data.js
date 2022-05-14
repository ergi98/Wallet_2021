const transactions = [
	{
		amount: 100,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 30.64,
		currency: "6241bd1a5fd5a56d6f4f090c", // EUR
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 200.25,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 120.29,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 1.22,
		currency: "6241bd1a5fd5a56d6f4f090c", // EUR
		rate: 120.29,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 5.68,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 100.55,
		currency: "6241be145fd5a56d6f4f0913", // CHF
		rate: 115.74,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 10.78,
		currency: "6241be145fd5a56d6f4f0913", // CHF
		rate: 115.74,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 100,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 65.01,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 12.03,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 12.88,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 55.67,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 98.67,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 93.31,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 129.03,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 4.35,
		currency: "6241be145fd5a56d6f4f0913", // CHF
		rate: 115.74,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 106.66,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 100,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 200,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 5,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 6.5,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 6.66,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 50,
		currency: "6241be145fd5a56d6f4f0913", // CHF
		rate: 115.74,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 20,
		currency: "6241be145fd5a56d6f4f0913", // CHF
		rate: 115.74,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 10,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 10.5,
		currency: "6241bd1a5fd5a56d6f4f090c", // EUR
		rate: 120.29,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 6.67,
		currency: "6241bd1a5fd5a56d6f4f090c", // EUR
		rate: 120.29,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 106.5,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 110.43,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 600.43,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 7,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 76.99,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 99.9,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 55.24,
		currency: "6241bd7a5fd5a56d6f4f0910", // GBP
		rate: 140.54,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 6.22,
		currency: "6241bd7a5fd5a56d6f4f0910", // GBP
		rate: 140.54,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 5.66,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 10.56,
		currency: "6241bd1a5fd5a56d6f4f090c", // EUR
		rate: 120.29,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 16.7,
		currency: "6241bd7a5fd5a56d6f4f0910", // GBP
		rate: 140.54,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 187.53,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job B",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 12.4,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 16.7,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 76.8,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 3.56,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 6.78,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 7,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 8,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		category: "Entertainment",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 111.22,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "A",
	},
	{
		amount: 54.6,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 2.45,
		currency: "6241bd7a5fd5a56d6f4f0910", // GBP
		rate: 140.54,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 56.43,
		currency: "6241a5695fd5a56d6f4f085a", // ALL
		rate: 1,
		source: "Job A",
		type: "6241a7d75fd5a56d6f4f0874", // EARNING
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
	{
		amount: 5.35,
		currency: "6241bcc55fd5a56d6f4f090a", // USD
		rate: 113.88,
		category: "Food",
		type: "6241a7b25fd5a56d6f4f0872", // EXPENSE
		day: 8,
		month: 4,
		year: 2022,
		portfolio: "B",
	},
];

const portfolios = [
	{
		type: "6241afa35fd5a56d6f4f0891",
		description: "A",
		color: "red",
	},
	{
		type: "6241afb65fd5a56d6f4f0892",
		description: "B",
		color: "red",
		validity: "2023-04-12T21:59:59.999Z",
		cvc: "124",
		bank: "6241b1e65fd5a56d6f4f08a4",
		cardNumber: "1234567812345678",
	},
	{
		type: "6241afa35fd5a56d6f4f0891",
		description: "C",
		color: "orange",
	},
];

const sources = [{ name: "Job A" }, { name: "Job B" }];

const categories = [{ name: "Entertainment" }, { name: "Food" }];

const user = {
	username: "johndoe",
	password: "testPassword123",
	personal: {
		name: "John",
		surname: "Doe",
	},
};

export { transactions, portfolios, categories, sources, user };
