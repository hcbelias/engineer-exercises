import { Router } from "express";
import { checkoutHandler } from "../handlers/checkout.handler";

export const checkoutRouter = Router();

checkoutRouter.post("/checkout", checkoutHandler);
