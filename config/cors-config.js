import origins from "./origins.js";

const corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: (origin, callback) => {
		console.log(origin);
		if (origins.includes(origin)) callback(null, true);
		else callback(new Error("Not allowed by CORS"));
	},
};

export default corsOptions;
