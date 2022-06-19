const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

/* Helper */
// pang check ng Google JWt
const GAuthVerify = require("../../helper/GAuthVerify");

/* Models */
const User = require("../../models/User");
const Email_Confirmation = require("../../models/email_confirmation");
const TwoFactorAuth = require("../../models/TwoFactorAuth");
const RecoveryCode = require("../../models/RecoveryCode");
const Admin = require("../../models/Admin");

/* Middleware */
const auth = require("../../middleware/auth");

/* EMailer */
const sendEmail = require("../../helper/SendEmail");

let ObjectId = require("mongoose").Types.ObjectId;

/* CONFIG */
const HAS_SSL = process.env.HAS_SSL
const loftCookieConifg = HAS_SSL === true ? { httpOnly: true, secure: true, SameSite: "None" } : { httpOnly: true, SameSite: "Lax" };

//generate loft confirmation code
let generateCode = () => {
  let code = randomstring.generate({
    length: 6,
    charset: "1234567890",
  });
  return code;
};

//generate expiration date/time
const getAddedMinutes = () => {
  var minutesToAdd = process.env.EML_CONF_EXP_DRTN;
  var currentDate = new Date();
  return new Date(currentDate.getTime() + minutesToAdd * 60000);
};

// generate cookie expiration/maxAge
const createCookieExpiration = (hour) => {
  return Number.parseInt(process.env.COOKIE_EXP) * 60 * 60 * 1000;
};

// check loft confirmation code expiry d1-current d2-expiry
let isExpired = (d2) => {
  return new Date().getTime() > new Date(d2).getTime();
};

// generate a token
const generateToken = (user_data) => {
  return jwt.sign(user_data, process.env.JWT_SCRT, {
    expiresIn: process.env.JWT_EXP_TIME,
  });
};

router.post("/recover", async (req, res) => {
  const { email_address, newPassword, recovery_code } = req.body;

  if (!email_address)
    return res.status(400).json({
      err: 400,
      description: "Required Data Missing",
      solution: "Please input all required data",
    });

  const USER = await User.findOne({ email_address });

  //check if email not exist in db
  // return no user
  if (!USER)
    return res.status(404).json({
      err: 404,
      description: "Account Not Found",
      solution:
        "The given credential doesn't belong to our existing users, please create an account",
    });

  //if no recovery code provided
  if (!recovery_code) {
    let rec_code = generateCode();
    //create code (findOneUpdate, upsert)
    const code = await RecoveryCode.findOneAndUpdate(
      { email_address, used: false },
      {
        user_ID: USER._id,
        email_address,
        recovery_code: rec_code,
        exp: getAddedMinutes(),
      },
      { new: true, upsert: true }
    );

    // sent it to email TODO: implement future email helper
    //return 200 code sent
    // template_content  { email_address, user_name, template_name, subject}
    let toSent = { ...USER.toObject(), recovery_code: rec_code };

    let targetEmails = [USER.email_address, ...USER.recovery_emails]

    targetEmails.forEach((email_addr) => {
        const sendConfirmationCode = sendEmail(email_addr, {
            ...toSent,
            template_name: "Recovery.html",
            subject: "Loft16 Account Recovery",
          });
    })

    return res.status(200).json({
      recovery_code_sent: true,
      message: "recovery code sent!",
    });
  } else {
    //query recovery code matching email && not marked as used
    const USER_RECOVERY = await RecoveryCode.findOne({
      email_address,
      used: false,
    });

    //if none then
    //return 410 we haven't establish a recovery code fo that email, try again
    if (!USER_RECOVERY)
      return res.status(403).json({
        err: 403,
        description: "You didn't Send Us Recovery Request",
        solution:
          "We haven't establish a recovery code for your email, Try recovery again",
      });

    if (recovery_code !== USER_RECOVERY.recovery_code)
      return res.status(401).json({
        err: 401,
        description: "The provided recovery code is not correct",
        solution: "Please make sure that the recovery code provided is correct",
      });

    // check if the given code is expired or not
    // if expired then return status 410 expired code
    if (isExpired(USER_RECOVERY.exp))
      return res.status(409).json({
        err: 409,
        description: "Your recovery code was expired",
        solution: "Please resend or signin again to get a new recovery code",
      });
    //end no other logic
  }

  const password = await bcrypt.hash(newPassword, 10);
  const updatedPassword = await User.findOneAndUpdate(
    { email_address },
    { $set: { password } }
  ).lean();

  //invalidate the recovery code
  const invalidateRecovery = await RecoveryCode.updateOne(
    { email_address, used: false },
    { $set: { used: true } }
  );

  //final return of response
  return res.status(201).json({
    code: 201,
    description: "User Created Successfully!",
    userData: {
      ...updatedPassword,
    },
  });
});

/* SIGNOUT NOTE: Might not be implemented because cookie/authorization automatically expires */
router.delete("/signout", auth, async (req, res) => {});

/*SIGNIN (manual, via Google SSO) */
router.post("/signin", async (req, res) => {
  const {
    access_token,
    client_id,
    admin,
    email_address,
    password,
    twoFactCode,
  } = req.body;

  console.log("SIGNIN LOGS: ", req.body)

  const ACCOUNT = admin ? Admin : User;
  const USER = await ACCOUNT.findOne({ email_address }).lean();

  // if this condition met, then user has authenticated via google SSO
  if ((access_token, client_id)) {
    try {
      const GUserInfo = await GAuthVerify(access_token, client_id);

      const userEmail = GUserInfo.email;
      const name = GUserInfo.name;
      const user_name = GUserInfo.given_name;

      let userData = await ACCOUNT.findOne({ email_address: userEmail });

      let flag = "old";

      if (!userData) {

        if(admin){
            return res.status(404).json({
                err: 404,
                description: "You are not one of the Admin",
                solution:
                  "Loft 16 identified your email is not one of admins. Please use a valid admin account",
              });
        }

        const genPass = generateCode();
        const hashedPassword = await bcrypt.hash(genPass, 10);
        const additional_attr = !admin ? { user_name } : {};
        userData = await ACCOUNT.create({
          ...additional_attr,
          name,
          profile_picture: GUserInfo.picture,
          email_address: userEmail,
          password: hashedPassword,
        });
        flag = "new";
        const mailsent = await sendEmail(userEmail, {
          name,
          user_name,
          email_address: userEmail,
          password: genPass,
          template_name: "YourPassword.html",
          subject: "Loft16 Sign Up Generated Password",
        });
      }

      // set cookies
      res.cookie("access_token", access_token, loftCookieConifg);
      res.cookie("client_id", client_id, loftCookieConifg);
      res.cookie("auth_iss", GUserInfo.iss, loftCookieConifg);

      const loginCount = await ACCOUNT.updateOne(
        { _id: userData._id },
        { $inc: { login_count: 1 } }
      );
      let userData2 = await ACCOUNT.findOne(
        { email_address: userEmail },
        { password: 0 }
      ).lean();

      let AUTHS = {}

      if(admin) AUTHS.admin_access_token = access_token
      else AUTHS.access_token = access_token

      //include flag to response
      return res.status(200).json({
        code: 200,
        description: "Signed in successfuly!",
        twoFactorRequired: false,
        GUserInfo,
        userData: { ...userData2, login_count: userData.login_count + 1 },
        flag,
        client_id,
        ...AUTHS,
        auth_iss : GUserInfo.iss
      });
    } catch (err) {
      return res.status(400).json({
        err: 403,
        error: err,
        description: "Something wen't wrong with your google authentication",
        solution: "Contact Developer or Try Again Later",
      });
    }
  }

  // beyond this point will be normal sign in authentication

  //check if all required fields has value
  if (!(email_address, password))
    return res.status(400).json({
      err: 400,
      description: "Required Data Missing",
      solution: "Please input all required data",
    });

  if (!USER)
    return res.status(404).json({
      err: 404,
      description: "Account Not Found",
      solution:
        `The given credential doesn't belong to our existing ${admin? 'admins' : 'users'}, ${admin? ' please contact authorized loft 16 admin to create your admin account' :' please create an account' }`,
    });

  if (!(await bcrypt.compare(password, USER.password)))
    return res.status(403).json({
      err: 403,
      description: "Forbidden",
      solution: "Please check the credential provided",
    });

  if (USER.two_factor_auth == true)
    if (!twoFactCode) {
      // ✅ Two Factor Sign In
      // iissue a two factor code & save it on two factor auth db

      let conf_code = generateCode();

      let code = await TwoFactorAuth.findOneAndUpdate(
        { email_address },
        {
          user_ID: USER._id,
          email_address,
          confirmation_code: conf_code,
          exp: getAddedMinutes(),
        },
        { new: true, upsert: true }
      );

      let toSent = admin? { ...USER, user_name : USER.name, two_fact_auth: conf_code } : { ...USER, two_fact_auth: conf_code }  ;
      const sendConfirmationCode = sendEmail(email_address, {
        ...toSent,
        template_name: "TwoFactorAuth.html",
        subject: "Loft16 TwoFactorAuthentication Code",
      });

      return res.status(200).json({ twoFactorRequired: true, code });
      // if code provided
    } else {
      // query the code from two_factor_auth
      const users_twoFactorCode = await TwoFactorAuth.findOne({
        email_address,
      });

      // if no result then it means hindi tayo nag signin
      if (!users_twoFactorCode)
        return res.status(403).json({
          err: 403,
          description: "You didn't Sign In",
          solution:
            "Looks like you don't have a valid confirmation code, please sign in",
        });

      // check if the given code  == two factor auth
      // if not, then return invalid auth 401
      if (twoFactCode !== users_twoFactorCode.confirmation_code)
        return res.status(401).json({
          err: 401,
          description: "The provided authentication code is not correct",
          solution: "Please make sure that the code provided is correct",
        });

      // check if the given code is expired or not
      // if expired then return status 410 expired code
      if (isExpired(users_twoFactorCode.exp))
        return res.status(409).json({
          err: 409,
          description: "Your two factor authentication code was expired",
          solution:
            "Please resend or signin again to get new confirmation code",
        });
      else await TwoFactorAuth.deleteOne({ email_address });
    }

  const token = generateToken({
    email_address,
    user_name: USER.user_name,
    _id: USER._id,
  });


  const USER2 = await ACCOUNT.findOne(
    { email_address },
    { password: 0 }
  ).lean();


  // set authorization via cookie & httponly secure desu
  res.cookie(admin ? "admin_access_token" : "access_token", token, { ...loftCookieConifg, maxAge: createCookieExpiration(process.env.COOKIE_EXP), });
  res.cookie("auth_iss", process.env.JWT_ISSUER, {...loftCookieConifg, maxAge: createCookieExpiration(process.env.COOKIE_EXP), });

  const loginCount = await ACCOUNT.updateOne(
    { _id: USER._id },
    { $inc: { login_count: 1 } }
  );

  let AUTHS = {}

  if(admin) AUTHS.admin_access_token = token
  else AUTHS.access_token = token

  AUTHS.auth_iss = process.env.JWT_ISSUER

  console.log("SENDING AUTH", AUTHS)

  return res.status(200).json({
    code: 200,
    description: "Signed in successfuly!",
    twoFactorRequired: false,
    userData: {
      ...USER2,
      login_count: USER.login_count + 1,
    },
    ...AUTHS
  });
});

/*SUGNUP && issuance of email confirmation if two factor enabled*/
router.post("/signup", async (req, res) => {
  const {
    access_token,
    client_id,
    name,
    user_name,
    email_address,
    password,
    confirmation_code,
  } = req.body;

  ///////////// for via google ///////////////
  try {
    if ((client_id, access_token)) {
      // verify if access token is valid

      const GUserInfo = await GAuthVerify(access_token, client_id);

      // if not valid then return 401, invalid G token
      if (!GUserInfo)
        return res.status(401).json({
          err: 401,
          description: "Your ",
        });

      // check if the user email exist
      let userData = await User.findOne({ email_address: GUserInfo.email });

      // if it does exist
      if (!userData)
        userData = await User.create({
          name,
          user_name,
          profile_picture: GUserInfo.picture,
          email_address: userEmail,
          password: hashedPassword,
        });

      //set cookiee access_token, client_id, auth_issuer
      res.cookie("access_token", access_token, loftCookieConifg);
      res.cookie("client_id", client_id, loftCookieConifg);
      res.cookie("auth_iss", GUserInfo.iss, loftCookieConifg);
      return res.status(200).json({ msg: "Ok! 👌" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      err: 500,
      description: e,
      solution: "Try Again Later",
    });
  }

  ///////// for normal signup //////////
  try {
    //check if all required fields has value
    if (!(name, user_name, email_address, password, confirmation_code))
      return res.status(400).json({
        err: 400,
        description: "Required Data Missing",
        solution: "Please input all required data",
      });

    //check again if email has duplicates
    const duplicates = await User.findOne({ email_address });
    if (duplicates)
      return res.status(409).json({
        err: 409,
        description: "User already exist using that Email",
        solution: "Please use other Email",
      });
    //get existing registration confirmation record
    const confirmation_codeRecord = await Email_Confirmation.findOne({
      email_address,
      used: false,
    });

    //check if the user already has an issued confirmation email
    if (!confirmation_codeRecord)
      return res.status(401).json({
        err: 401,
        description: "You didn't sign up",
        solution: "Please sign up",
      });

    //check if the given confirmation code is valid to the issued confirmation code
    if (confirmation_codeRecord.confirmation_code !== confirmation_code)
      return res.status(401).json({
        err: 401,
        description: "The confirmation code is not correct ",
        solution: "Please input a valid confirmation code",
      });

    //check if the confirmation code is still valid or has already expired
    if (isExpired(confirmation_codeRecord.exp))
      return res.status(410).json({
        err: 410,
        description: "The confirmation code has expired",
        solution: "Please resend or signup again",
      });


    //if everything goes right, the registration entry confirmation code will be cleared from
    //loft 16 confirmation code collections
    const ress = await Email_Confirmation.deleteOne({ email_address });

    //user password will be hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    //creation of user data to database
    let user = await User.create({
      name,
      user_name,
      email_address,
      password: hashedPassword,
    });

    const token = generateToken({ user_name, email_address });

    // set authorization via cookie & httponly
    res.cookie("access_token", token, {
      ...loftCookieConifg,
      maxAge: createCookieExpiration(process.env.COOKIE_EXP),
    });
    res.cookie("auth_iss", process.env.JWT_ISSUER, {
      ...loftCookieConifg,
      maxAge: createCookieExpiration(process.env.COOKIE_EXP),
    });


    //final return of response
    return res.status(201).json({
      code: 201,
      description: "User Created Successfully!",
      userData: {
        ...user.toObject(),
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      err: 500,
      description: e,
      solution: "Try Again Later",
    });
  }
});

//Email Confirmation
router.post("/confirm_email", async (req, res) => {
  try {
    const { isResent, name, user_name, email_address, password } = req.body;

    if (!(name, user_name, email_address, password))
      return res.status(400).json({
        err: 400,
        description: "Required Data Missing",
        solution: "Please input all required data",
      });

    let email_confirmation = await Email_Confirmation.findOne({
      email_address,
      used: false,
    });

    let alreadyInUse = await User.findOne({ email_address });

    if (alreadyInUse)
      return res.status(409).json({
        err: 409,
        description: "Email is already used",
        solution: "Please use other email",
      });

    if (email_confirmation)
      await Email_Confirmation.deleteOne({ email_address });

    email_confirmation = await Email_Confirmation.create({
      name,
      user_name,
      email_address,
      password,
      confirmation_code: generateCode(),
      exp: getAddedMinutes(),
    });

    // template_content  { email_address, user_name, template_name, subject}
    if (!req.body.debug)
      sendConfirmationCode = sendEmail(email_address, {
        ...email_confirmation.toObject(),
        template_name: "EmailConfirmation.html",
        subject: "Loft16 Sign Up Email Confirmation",
      });

    return res.status(201).json({
      status: 201,
      message:
        "Registration created, Please see confirmation code we sent to your Email",
    });
  } catch (e) {
    console.log(e);
    return res.status(408).json({
      status: 403,
      message: "Theres an error",
      err: e,
    });
  }
});

module.exports = router;
