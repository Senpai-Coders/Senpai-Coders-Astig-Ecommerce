const mongoose = require("mongoose");

const pending_order = new mongoose.Schema({
    schema_v: { type: Number, default: 1 },
    order_ID: { type: mongoose.ObjectId, required: true, unique : true},
    user_ID : {type : mongoose.ObjectId, required : true },
    user_email : {type : String, required : true},
    n_items : {type : Number, required : true},
    total_cost : {type : Number, required : true},
    mode_of_payment : { type : String, default : "COD" },
    transaction_no : { type : String, default : null },
    courier : { type : {} , required : true},
    cat: { type: Date, default: Date.now },
    uat: { type: Date, default: Date.now },
    uby: {type : mongoose.ObjectId, default : null},
    dat: { type: Date, default: null },
});

module.exports = mongoose.model("pending_order", pending_order);
