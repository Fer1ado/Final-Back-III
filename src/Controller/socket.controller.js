import { MongoProductManager } from "./Manager/productManager.js";

export const adminSocket = async (socket) => {
    console.log("Servidor Socket.io conectado");

    const returnmsg = async(msg) => socket.emit("status-message", msg)
    const reloadPg = async() => socket.emit("reload")
    
    socket.on('nuevoProducto', async (nuevoProd) => {
        try {
            const newprod =  await MongoProductManager.addProduct(nuevoProd);
            if(newprod.status === "success") {
                reloadPg()
                }
            else {
                returnmsg(newprod.message)}
        } catch (error) {
            
        }  
    });
    
    socket.on("update-products", async () => {
    const mensaje = await MongoProductManager.getAllProducts()
    socket.emit("products-data", mensaje.products.reverse())
    
    })

    socket.on("remove-product", async (cod) => {
        const remove = await MongoProductManager.deleteProduct(cod)
        console.log(remove)
        socket.emit("Produc-removed", remove)
        reloadPg()
    })
  }