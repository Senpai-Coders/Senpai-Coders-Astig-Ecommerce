const ObjectId = require('mongoose').Types.ObjectId;


const ehandler = (err, res) => {
    console.log(err);
    res.status(500).json({
      status: 500,
      description: "Internal Server Error",
      solution: "Sorry but the server has an error, please try again later",
    });
}

function checkObjectId(id){
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

module.exports = { ehandler, checkObjectId }