import origins from "./origins.js";

const corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: (origin, callback) => {
		if (origins.includes(origin) || !origin) callback(null, true);
		else callback(new Error("Not allowed by CORS"));
	},
};

export default corsOptions;
