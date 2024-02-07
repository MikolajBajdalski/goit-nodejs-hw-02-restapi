import express from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/api/userRoutes.js";
import contactsRouter from "./routes/api/contacts.js";

const app = express();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

export default app;
