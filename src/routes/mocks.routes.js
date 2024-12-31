import {Router} from "express"
import { apiUserController } from "../Controller/user.controller.js";

const mocksApiRoute = Router()

mocksApiRoute.post("/generatemockdata", apiUserController.mockUserTest);

mocksApiRoute.post("/generateAndSaveMockDataToDB", apiUserController.mockUserCreate);


export default mocksApiRoute