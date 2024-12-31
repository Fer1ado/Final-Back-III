import {Router} from "express"
import { userController } from "../Controller/user.controller.js";


const userRoute = Router()

userRoute.post("/register", userController.register);

userRoute.post("/login", userController.login);

userRoute.post("/logout", userController.logout)

/*--------------------------------GITHUB------------------------------*/
userRoute.get("/register-github", userController.githubReg)
userRoute.get("/github", userController.githubAuth)

/*--------------------------------GOOGLE------------------------------*/
userRoute.get("/oauth2/redirect/accounts.google.com", userController.googleAuth)
userRoute.get("/register-google", userController.googleReg)


export default userRoute;

