const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  schema_v : { type : Number, default : 1, required : false },
  name : { type :  String, required : true},
  profile_picture : {type : String, required : false, default : "https://cdn.discordapp.com/attachments/912411399458795593/936870864186642432/unknown.png"},
  email_address : { type: String, unique : true, required : true },
  recovery_emails : { type: Array, default : []},
  mobile_numbers : { type: Array, default : []},
  role : {type : String, default : "Admin"},
  login_count : {type : Number, default : 0},
  password : {type : String, required : true},
  action_count : { type : Number, default : 0},
  two_factor_auth : {type: Boolean, default : false},
  cat : {type : Date, default : Date.now},
  uat : {type : Date, default : null},
  uby : {type : mongoose.ObjectId, default : null},
  dat : {type : Date, default : null}
});

module.exports = mongoose.model("admin", adminSchema);