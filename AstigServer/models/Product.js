const mongoose = require('mongoose')

// name
// is_hot
// description
// variants

const productSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    name : { type : String , unique : true , required : true},
    categories : { type : [], default : []},
    likes : { type : Number, default : 0},
    total_stock : { type : Number , default : 0},
    is_hot : { type : Boolean, default : false},
    replacement_day : { type : Number, default : 0},
    Images : { type : [], default : [] },
    description : { type : String, required : true },
    variants : { type : [], required : true },
    n_ratings : { type : Number, default : 0 },
    n_no_ratings : { type : Number, default : 0},
    ratings : { type : [], default : [] },
    total_item_sold : { type : Number , default : 0},
    generated_sale : {type : Number, default : 0.0},
    cat : {type : Date, default : Date.now} ,
    cby : {type : mongoose.ObjectId, default : null},
    uat : {type : Date, default : Date.now} ,
    uby : {type : mongoose.ObjectId, default : null},
    dat : {type : Date, default : null } ,
})

module.exports = mongoose.model("product", productSchema)