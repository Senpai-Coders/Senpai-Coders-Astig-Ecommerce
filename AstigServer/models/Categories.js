const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
  schema_v: { type: Number, default: 1 },
  category_name: { type: String, required: true , unique : true},
  associated_products : { type: [], default: [] },
  cat: { type: Date, default: Date.now },
  cby: { type: mongoose.ObjectId, default: null },
  uat: { type: Date, default: Date.now },
  uby: { type: mongoose.ObjectId, default: null },
  dat: { type: Date, default: null },
});

module.exports = mongoose.model("Categorie", Categories);
