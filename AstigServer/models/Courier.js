const mongoose = require("mongoose");

const courier = new mongoose.Schema({
  schema_v: { type: Number, default: 1 },
  courier_name: { type: String, required: true , unique : true},
  courier_email: { type: String, required: true },
  courier_contact: { type: String, required: true },
  total_delivered_orders: { type: Number, default: 0 },
  delivered_orders: { type: [], default: [] },
  cat: { type: Date, default: Date.now },
  cby: { type: mongoose.ObjectId, default: null },
  uat: { type: Date, default: Date.now },
  uby: { type: mongoose.ObjectId, default: null },
  dat: { type: Date, default: null },
});

/*
    _id : 0
    courier_name : 1
    courier_email : 1
    courier_contact : 1
    total_delivered_orders : 1
    cat : 1
    cby : 1
*/
module.exports = mongoose.model("courier", courier);
