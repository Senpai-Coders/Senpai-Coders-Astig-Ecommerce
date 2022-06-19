const mongoose = require("mongoose");

const chat = new mongoose.Schema({
    schema_v: { type: Number, default: 1 },
    user_id : { type: mongoose.ObjectId, required: true },
    profile_info : { type : {} , required : true },
    messages : { type: [], default : [] },
    hasNewMessage : { type : Boolean, default : false },
    hasAdminReply : {type : Boolean, default : false},
    total_cost : { type : Number, required : true }, 
    cat: { type: Date, default: Date.now },
    dat: { type: Date, default: null }
});

/*
  profile_info : {
      name, picture
  }
 -> admin 0 -> user
  message Object
  {
        "type": "0",
        "message": "Hello World!",
        "cat": {
            "$date": "2022-03-05T16:00:00.000Z"
        }
   }


{
    "user_id": {
        "$oid": "620df7e1563a81177f8049ee"
    },
    "profile_info": {
        "name": "jervx",
        "picture": "lastMessage"
    },
    "messages": [{
        "type": "0",
        "message": "Hello World!",
        "cat": {
            "$date": "2022-03-05T16:00:00.000Z"
        }
    }, {
        "type": "1","profile" : {
          "name" : "Jervx",
          "profile" : "https://192.168.1.5:3001/static/profile/2022-02-22T02:39:17.715Z-b85c2f19-1668-4764-9c46-2fb257b13f71-jer.jpg",          
          "role" : "admin"       
        },  
        "message": "Okay",
        "cat": {
            "$date": "2022-03-05T16:00:00.000Z"
        }
    }, {
        "type": "0",
        "message": "Hello World 1!",
        "cat": {
            "$date": "2022-03-05T16:00:00.000Z"
        }
    }, {
        "type": "0",
        "message": "Hello World 2!",
        "cat": {
            "$date": "2022-03-05T16:00:00.000Z"
        }
    }],
    "cat": {
        "$date": "2022-03-05T16:00:00.000Z"
    }
}

*/
module.exports = mongoose.model("chat", chat);
