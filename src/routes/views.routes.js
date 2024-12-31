import { Router } from "express";
import { passportCall } from "../middleware/passportCall.middleware.js";
import { checkAdmin, checkUser } from "../middleware/roleCheck.handler.js"
import * as controller from "../Controller/views.controller.js"

const viewsRoute = Router()


/*--------------------------------VISTAS PUBLIC------------------------------*/

viewsRoute.get("/", controller.home)

/* viewsRoute.get("/about", controller.about)

 */

viewsRoute.get("/register", controller.register)

viewsRoute.get("/login", controller.login)

viewsRoute.get("/loginError", controller.loginError)

/*--------------------------------VISTAS PRIVATE------------------------------*/
// vista de perfil de usuario con display de token
viewsRoute.get("/user/profile", passportCall('jwtCookies'), controller.profile)

// vista de productos en handlebars 
viewsRoute.get("/products", passportCall('jwtCookies'), controller.vistaProducts);

//Vista de carrito interactiva con productos
viewsRoute.post("/products/api/cart/:cid/product/:pid", passportCall('jwtCookies'), checkUser, controller.vistaCart)

//Vista de carrito con ruta GET
viewsRoute.get("/products/api/cart/:cid/product/delete/:pid", passportCall('jwtCookies'), checkUser, controller.vistaDeleteItem)

//Vista borrado carro completo
viewsRoute.post("/products/api/cart/delete/:cid", passportCall('jwtCookies'), checkUser, controller.vistaDeleteCart)

//Vista de carrito con id
viewsRoute.get("/products/api/cart/:cid", passportCall('jwtCookies'), checkUser, controller.vistaCartId) 

//vista del ticket Checkout
viewsRoute.get("/products/api/cart/:cid/purchase", passportCall('jwtCookies'), checkUser, controller.vistaCheckout)

//vista del admin
viewsRoute.get("/adminsection", passportCall('jwtCookies'), checkAdmin, controller.adminsection)


export default viewsRoute;

