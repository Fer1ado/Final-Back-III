export const info = {
    definition:{
        openapi: "3.0.1",
        info:{
            title: "api tienda",
            version: "1.0.0",
            description: "API para gestionar productos, carrito, y pedidos",
            contact:{ mail: "leandro.varela@gmail.com", phone:"68738665"
                    },
        },
        servers:[
            {url: "hhtp://localhost:8080"}
        ]
    },
    apis: ["./src/docs/*.yml"]
}