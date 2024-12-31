import {Router} from "express"
import { apiUserController } from "../Controller/user.controller.js";

const userApiRoute = Router()

userApiRoute.post("/mockUsers", apiUserController.mockUserCreate);

userApiRoute.post("/register", apiUserController.register);

userApiRoute.post("/login", apiUserController.login);

userApiRoute.post("/logout", apiUserController.logout)

export default userApiRoute