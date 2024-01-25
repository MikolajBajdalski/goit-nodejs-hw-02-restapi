import express from "express.js";
import logger from "morgan.js";
import cors from "cors.js";
require("dotenv").config();
import userRoutes from "./routes/api/userRoutes.js";

import contactsRouter from "./routes/api/contacts.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

export { app };
