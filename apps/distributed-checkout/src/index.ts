import express from "express";
import { checkoutRouter } from "./routes/checkout.router";
import { logger } from "./observability/logger";

const app = express();

app.use(express.json());

// Attach correlationId from header or generate one for every request
app.use((req, _res, next) => {
  req.headers["x-correlation-id"] = req.headers["x-correlation-id"] ?? crypto.randomUUID();
  next();
});

app.use("/", checkoutRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3006;
app.listen(PORT, () => {
  logger.info(`[server] distributed-checkout listening on http://localhost:${PORT}`);
  logger.info("[server] Try: curl -X POST http://localhost:3006/checkout ...");
});

export { app };
