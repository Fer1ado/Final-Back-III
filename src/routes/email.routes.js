import { Router } from "express";
import { sendGmail } from "../pipe/email.controller.js";

const mailRoute = new Router()

mailRoute.post("/gmail", sendGmail)

export default mailRoute;