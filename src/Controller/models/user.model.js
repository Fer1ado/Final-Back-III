import {Schema, model} from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const userSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pets:{
        type: Array,
        default: []
    },
    age:{
        type: Number,
        required: false,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cart:{ 
        type: Schema.Types.ObjectId,
        ref: "carts",
        default: null  // Por defecto el usuario no tiene carrito asociado
    }
})


userSchema.plugin(mongoosePaginate) 

export const userModel = model('users', userSchema)