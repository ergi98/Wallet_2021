// .env
import "dotenv/config";

// CORS
import cors from "cors";

// Express
import express from "express";

// Mongoose
import mongoose from "mongoose";

// HTTP
import { createServer } from "http";

// Routes
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import bankRoutes from "./routes/bank-routes.js";
import sourceRoutes from "./routes/source-routes.js";
import journalRoutes from "./routes/journal-routes.js";
import categoryRoutes from "./routes/category-routes.js";
import currencyRoutes from "./routes/currency-routes.js";
import portfolioRoutes from "./routes/portfolio-routes.js";
import transactionRoutes from "./routes/transaction-routes.js";

// Middleware
import tokenMiddleware from "./middleware/token-middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", tokenMiddleware, userRoutes);
app.use("/bank", tokenMiddleware, bankRoutes);
app.use("/source", tokenMiddleware, sourceRoutes);
app.use("/journal", tokenMiddleware, journalRoutes);
app.use("/category", tokenMiddleware, categoryRoutes);
app.use("/currency", tokenMiddleware, currencyRoutes);
app.use("/portfolio", tokenMiddleware, portfolioRoutes);
app.use("/transaction", tokenMiddleware, transactionRoutes);

const port = process.env.PORT;

const server = createServer(app);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log(`Successfully connected to MongoDB`))
	.catch((err) => console.log(err));

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
