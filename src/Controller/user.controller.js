
import UserDTO from "../middleware/user.dto.js";
import { userManager } from "./Manager/userManager.js"; 
import {userAndPetMock} from "./Manager/mock.user.manager.js"
import { ulid } from "ulid"; 
import {createHash} from "../utils/utils.js"
import passport from "passport";


class UserInterface{

    register = async (req, res, next) => {
        try {
            const response = await userManager.createUser(req.body);
            if (response.status === "failed"){
                req.session.messages = response.message
                res.redirect("/loginError")
            } else 
            req.session.messages = response.message
            res.redirect("/login");
        } catch (error) {
            next(error);
        }
    };
    
    login = async (req, res, next) => {
        try {
            const response = await userManager.login(req.body);
                if(response.status === "failed"){ 
                req.session.messages = response.message
                res.redirect("/loginError")}
                else {
            req.session.cookie.token = response.token;
            req.session.user = new UserDTO(response.user, response.token );
            req.session.token = response.token
            res.cookie('token', response.token, { httpOnly: true }).redirect("/user/profile")
            }
        } catch (error) {
            next(error);
        }
    };
    
    profile = async (req, res, next) => {
        try {
            const { first_name, last_name, email } = req.user;
            res.json({first_name, last_name, email});
        } catch (error) {
            next(error);
        } 
    };
    
    logout = async (req, res, next) => {
        try {
            //console.log(req.session)
            req.logout((err) => {
                if(err) return res.send(err)
                res.clearCookie("token").redirect("/login")
            //console.log(req.session)
            })
        } catch (error) {
            next(error);
        }
    }
    
    
    githubReg = ()=>{ passport.authenticate("github",{scope:["user:email"]})}
    githubAuth = ()=>{ passport.authenticate("github",{failureRedirect: '/loginError', successRedirect: "/user/profile", passReqToCallback: true, failureMessage: true}), async (req, res) => {res.redirect("/")}}
    
    
    googleReg = () =>{ passport.authenticate("google", {scope:["profile"]})}
    googleAuth = ()=>{ passport.authenticate("google", {assignProperty: "user", successRedirect: "/user/profile", failureRedirect: "/loginError", passReqToCallback: true}), async (req, res) => {res.redirect("/user/profile")}}

}

export const userController = new UserInterface()




class ApiUserInterface{

mockUserCreate = async (req, res, next) => {
    let responseArray = []
    let failedArray = []

    try {
        const uq = req.body.usersQuant
        const pq = req.body.petsQuant
        const response = await userAndPetMock(uq, pq)
        console.log(response)
        if(response.status === "failed"){
            return res.status(404).send(response)
        } else{
            for (const un in response.payload) {
                const DBresponse = await userManager.createUser(response.payload[un])
                if (DBresponse.status === "failed"){
                    console.log(DBresponse.message)
                    failedArray.push(DBresponse.message)
                } else {
                    responseArray.push(DBresponse.newUser)
                }
            }
            res.status(200).send({solicitudesExitosas: responseArray, solicitudesFallidas: failedArray})
        }
    } catch (error) {
        next(error);
    }
}

mockUserTest = async (req, res, next) => {
    try {
        const uq = req.body.usersQuant
        const pq = req.body.petsQuant
        //console.log("🚀 ~ file: user.controller.js:90 ~ ApiUserInterface ~ mockUserCreate= ~ uq:", uq);
        const response = await userAndPetMock(uq, pq)
        let responseAsDb = []
        for (const item of response.payload) {
            item._id = ulid()
            item.password = await createHash(item.password)
            item.pets = []
            responseAsDb.push(item)
        }  
        if(response.status === "failed"){
            return res.status(404).send(response)
        } else
        res.status(200).send(responseAsDb)

    } catch (error) {
        next(error);
    }
}

register = async (req, res, next) => {
        try {
            const response = await userManager.createUser(req.body);
            if (response.status === "failed"){
                req.session.messages = response.message
                res.status(400).send(response.message)
            } else 
            req.session.messages = response.message
            res.status(200).send(new UserDTO(response.newUser));
        } catch (error) {
            next(error);
        }
    };

login = async (req, res, next) => {
        try {
            const response = await userManager.login(req.body);
                if(response.status === "failed"){ 
                req.session.messages = response.message
                
                res.status(400).send(response.message)}
                else {
            req.session.cookie.token = response.token;
            req.session.user = response.user
            req.session.token = response.token
            
            res.cookie('token', response.token, { httpOnly: true }).status(200).send(new UserDTO(response.user, response.token))
            }
        } catch (error) {
            next(error);
        }
    }

logout = async (req, res, next) => {
    try {
        req.logout((err) => {
            if(err) return res.status(400).send(error.message)
            res.clearCookie("token").status(200).send({status: "success", message:"logout successfull"})
        })
    } catch (error) {
        next(error);
    }
}

}

export const apiUserController = new ApiUserInterface();