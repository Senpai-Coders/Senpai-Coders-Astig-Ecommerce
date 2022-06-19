const jwt = require("jsonwebtoken");
const config = process.env;
const GAuthVerify = require("../helper/GAuthVerify");
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const verifyToken = async (req, res, next) => {
  const Authorization = req.body.auth;
  //console.log("RECIEVED AUTH:", Authorization);
  let token = Authorization.access_token;
  let client_id = Authorization.client_id;
  let auth_iss = Authorization.auth_iss;

  //await snooze(5000)

//   console.log(
//     "--------COOKIES USER AUTH CHECK----------\n",
//     token + "\n---\n",
//     client_id + "\n----\n",
//     auth_iss
//   );
  if (auth_iss !== 'loft16')
    if (client_id) {
      try {
        const auth_user = await GAuthVerify(token, client_id);
        return next();
      } catch (error) {
        return res.status(401).json({
          err: 401,
          description: "Your authorization has expired",
          solution: "Login to google again to gain Authorization",
        });
      }
    }

  if (!token)
    return res.status(403).json({
      err: 403,
      description: "Your sign in was expired",
      solution: "Please sign out & sign in again",
    });
  try {
    const user = jwt.verify(token, config.JWT_SCRT);
    return next();
  } catch (err) {
    //console.log("Not Correct JWT");
    return res.status(401).json({
      err: 401,
      description: "Your authorization has expired",
      solution: "Login again to gain Authorization",
    });
  }
};

module.exports = verifyToken;
