import { MongoCartManager } from "./cartManager.js"
import { MongoProductManager } from "./productManager.js"
import { userManager } from "./userManager.js"
import { ticketModel } from "../models/ticket.model.js"
import { ulid } from "ulid"


class ticketDAO {

    generateTicket = async (cid, session) => {

        try {

            const cart = await MongoCartManager.getCarrito(cid)
            const user = await userManager.getUserById(session.user._id)
            const content = cart.busqueda[0].products

            if (!cart || !user) {
                return { status: "failed", message: "Carrito o Usuario no encontrado" }
            }

            //CHEQUEO Y ACTUALIZO CANTIDADES DEL PRODUCT
            const saleUpdate = async () => {
                const items = content
                const sold = []
                const unsold = []
                let amount = 0
                // console.log("🚀 ~ file: ticketManager.js:34 ~ ticketDAO ~ updateQuantity ~ content:", content);
                for (let purchase of items) {
                    const record = await MongoProductManager.getProductById(purchase.product._id)
                    //Actualizo cantidades si hay existencias
                    if (record.product.stock > purchase.quantity) {
                        const newQuantity = { stock: record.product.stock - purchase.quantity }
                        const updateProd = await MongoProductManager.updateProduct(purchase.product._id, newQuantity)
                        //console.log("🚀 ~ file: ticketManager.js:43 ~ ticketDAO ~ updateQuantity ~ updateProd:", {nombreProd: updateProd.productoActualizado.title, nuevoStock: updateProd.productoActualizado.stock});
                        sold.push({ producto: record.product.title, cantidad: purchase.quantity })
                        amount += (record.product.price * purchase.quantity)
                    }
                    else {
                        unsold.push({ producto: record.product.title, motive: "Insuficcient Stock" });
                        console.log(unsold)
                    }
                }


                if (sold.length > 0) {
                    const purchaseCode = ulid()
                    const date = () => {
                        const UTF = new Date()
                        const timezone = UTF.getTimezoneOffset()
                        return (UTF - timezone)
                    }

                    const ticket = await ticketModel.create({
                        code: purchaseCode,
                        user: user._id,
                        cart: sold,
                        purchaseTimeStamp: date(),
                        amount: amount,
                        purchaser: user.email,
                    })

                    console.log("🚀 ~ file: ticketManager.js:62 ~ ticketDAO ~ TICKET GENERADO CON EXITO:", ticket);
                    console.log("🚀 ~ file: ticketManager.js:62 ~ ticketDAO ~ productos sin vender:", unsold);
                    return { status: "success", message: "Ticket generado con exito", ticket, unsold }

                } else {
                    return { status: "failed", message: "no hay stock de los productos seleccionados para conpletar la compra", unsold }
                }
            }

            const update = await saleUpdate()
            return { status: "succes", message: update.message, ticket: update.ticket, unsold: update.unsold }

        } catch (error) {
            return { status: "failed", error: error.message }
        }
    }



}


export const ticketManager = new ticketDAO()