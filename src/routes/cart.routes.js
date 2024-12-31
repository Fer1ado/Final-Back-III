import { Router } from "express";
import { passportCall } from "../middleware/passportCall.middleware.js";
import * as controller from "../Controller/cart.controller.js"
import { checkAdmin, checkUser } from "../middleware/roleCheck.handler.js"

const cartRoute = Router();

/// lista todos los carritos registrados en la BD
cartRoute.get("/", passportCall('jwtCookies'), controller.listAllCarts)

/// lista un carrito en particular por ID
cartRoute.get("/:cid", passportCall('jwtCookies'), controller.getCartById)

/// crea un nuevo carrito en la BD
cartRoute.post("/", passportCall('jwtCookies'), controller.createCart)

/// Inicia el proceso de compra y generacion de ticket para el carrito indicado
cartRoute.post("/:cid/purchase", passportCall('jwtCookies'), checkUser, controller.purchaseCartById)

/// agrega un producto al carrito o actualiza cantidades de producto ya agregado
cartRoute.post("/:cid/product/:pid", passportCall('jwtCookies'), checkUser, controller.addAndUpdateCart)

/// actualiza un carrito en la BD pero cargando varios productos y varias cantdiades via array en body
cartRoute.put("/:cid", passportCall('jwtCookies'), checkUser, controller.addAndUpdateCartViaArray)

/// elimina un producto del carrito
cartRoute.delete("/:cid/product/:pid", passportCall('jwtCookies'), checkUser, controller.deleteProductInCartById)

/// elimina un carrito completo de la BD por ID
cartRoute.delete("/:cid", passportCall('jwtCookies'), controller.deleteCartById)


export default cartRoute