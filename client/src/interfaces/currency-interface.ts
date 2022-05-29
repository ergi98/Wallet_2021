interface Currency {
	_id: string;
	name: string;
	symbol: string;
	acronym: string;
	rateToDefault: number;
}

export type { Currency };
