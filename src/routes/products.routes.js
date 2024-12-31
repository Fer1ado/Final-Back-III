import { Router } from "express";
import * as controller from "../Controller/product.controller.js"
import { passportCall } from "../middleware/passportCall.middleware.js";
import { checkAdmin, checkUser } from "../middleware/roleCheck.handler.js"

const prodRoute = Router();


//pedido de productos por ID
prodRoute.get("/:pid", passportCall('jwtCookies'), controller.getProductById);

// Busqueda de Products con paginate y filtro
prodRoute.get("/", passportCall('jwtCookies'), controller.getAllProducts)

//Subida de productos
prodRoute.post("/", passportCall('jwtCookies'), checkAdmin, controller.addProduct);

//editado de producto
prodRoute.put("/:id", passportCall('jwtCookies'), checkAdmin,  controller.updateProductbyId);

//borrado de producto
prodRoute.delete("/:id", passportCall('jwtCookies'), checkAdmin, controller.deleteProductById);

//////////// **** comando de inicializacion de db
prodRoute.post("/many", controller.populateDb);


export default prodRoute;
