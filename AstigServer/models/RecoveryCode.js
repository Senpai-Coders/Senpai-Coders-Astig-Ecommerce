const mongoose = require("mongoose")

const RecoveryCodeSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    user_ID :  {type : mongoose.Types.ObjectId, required : true },
    email_address : { type: String, required : true },
    recovery_code : { type : String, required : true },
    iat : {type: Date, default : Date.now},
    exp : {type: Date, required : true},
    used : {type: Boolean, default : false}
  });
  
module.exports = mongoose.model("recovery_code", RecoveryCodeSchema);