import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchaseTimeStamp:{
        type: Date,
        required: true,
        default: new Date
    },
    cart:{
        type:[],
        default:[]
        
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        required: true
    }
})

ticketSchema.pre('findOne', function () {
    this.populate('carts._id')
})



export const ticketModel = model('ticket', ticketSchema)