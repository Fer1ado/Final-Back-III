
import 'dotenv/config'
import mongoose from 'mongoose';
import handlebars from "express-handlebars";
import path from "path"
import {Server} from "socket.io"
import displayRoutes from 'express-routemap';
import { errorHandler } from './middleware/error.hander.middleware.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from "connect-mongo"
import passport from "passport"
import { adminSocket } from './Controller/socket.controller.js';

import swaggerUI from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import {info} from "./Docs/info.js"


//estrategias de Passport
import "./passport/local-strategy.js"
import "./passport/github-strategy.js"
import "./passport/google-strategy.js"
import "./passport/jwt-strategy.js"


//importación de rutas
import cartRoute from "./routes/cart.routes.js";
import prodRoute from "./routes/products.routes.js";
import viewsRoute from "./routes/views.routes.js";
import userRoute from './routes/user.routes.js';
import userApiRoute from './routes/user.api.routes.js';
import mailRoute from './routes/email.routes.js';
import mocksApiRoute from './routes/mocks.routes.js';


/// CONFIG/IMPORT SERVIDOR
import express from "express";
import { _dirname } from "./utils/utils.js";


const app = express()
const PORT = 8080;

const specs = swaggerJSDoc(info);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

//Config Express-Session
const hashCode = process.env.SECRET_KEY

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.DB_CNN || "mongodb://localhost:27017/coderhouse",
    ttl: 360, // se detalla en segundos
    crypto: {
      secret: hashCode
    }
  }),
  secret: hashCode,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1800 * 100 // se detalla en milisegundos (5min)
}}

/// CONEXION A MONGO DB
mongoose.connect(process.env.DB_CNN || "mongodb://localhost:27017/coderhouse")
    .then(() => console.log('Conectado a Mongo Exitosamente'))
    .catch(() => console.log('Error al conectarse a la base de datos'))


// MIDDLEWARES GLOBALES
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(session(sessionConfig)) // inicialización de Middleware global sessions
app.use(cookieParser()) // inicicalización de Middleware global cookies
app.use(passport.initialize()) // ---> inicialización de middleware global de passport
app.use(passport.session()) // ---> inicialización de middleware global de passport-session (enlaza passport con express-session)
app.use(errorHandler)  // incorporación de Middleware Global manejo de errores



// RUTAS ESTATICAS PARA VIEWS
app.use("/static", express.static(_dirname + "/public"))
app.use("/products", express.static(_dirname + "/public"))
app.use('/adminsection', express.static(path.join(_dirname, '/public')))

// SETEO DE PUERTO
const server = app.listen(PORT, ()=>{
  console.warn("--------------------LISTADO DE RUTAS ACTIVAS EN EL PROYECTO-------------------")
  displayRoutes(app)
  console.log(`Server listening on port ${PORT}`)
})


// SOCKET IO PARA UPDATE DE PRODUCTS
const io = new Server(server);

io.on("connection", adminSocket )



// CONFIG HANDLEBARS
app.engine("handlebars", handlebars.engine())
app.set("views", path.resolve(_dirname, "./views"))
app.set("view engine", "handlebars")


//ROUTES
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute)
app.use("/api/users", userApiRoute)
app.use("/api/mocks", mocksApiRoute)
app.use("/users", userRoute);
app.use("/", mailRoute)
app.use("/", viewsRoute);


