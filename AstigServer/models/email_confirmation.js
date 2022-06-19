const mongoose = require("mongoose");


const email_confirmationSchema = new mongoose.Schema({
  schema_v : { type : Number, default : 1 },
  name : { type :  String, required : true},
  user_name: { type: String, required : true },
  email_address : { type: String, required : true },
  password : {type : String, required : true},
  confirmation_code : { type : String, required : true },
  iat : {type: Date, default : Date.now},
  exp : {type: Date, required : true}
});

module.exports = mongoose.model("email_confirmation", email_confirmationSchema);