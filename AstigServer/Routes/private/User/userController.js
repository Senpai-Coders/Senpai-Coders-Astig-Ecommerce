require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
const { ehandler } = require("../../../helper/utils");

const User = require("../../../models/User");
const auth = require("../../../middleware/auth");
const Order = require("../../../models/Orders");
const Pending_Order = require("../../../models/Pending_Order");
const Product = require("../../../models/Product");
const { v4: uuidv4 } = require("uuid");
const Chat = require("../../../models/Chat");
const Message = require("../../../models/Chat");

var multer = require("multer");

const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./static/profile`);
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString()}-${uuidv4()}-${file.originalname}`);
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 8388608 } });

router.post(
  "/uploadProfileD",
  upload.single("profile_picture", 5),
  async (req, res) => {
    try {
      const { _id } = req.body;
      let uploadInfo = req.file;
      if (_id) {
        const updateAdminData = await User.updateOne(
          { _id },
          {
            $set: {
              profile_picture: `${process.env.SELFURL}/${uploadInfo.path}`,
            },
          }
        );
      }

      res.status(200).json({
        message: "ok!",
        uploadInfo,
      });
    } catch (e) {
      ehandler(e, res);
    }
  }
);

router.post("/uploadProfile", auth, async (req, res) => {
  try {
    const { url, _id } = req.body;
    if (_id) {
      const updateAdminData = await User.updateOne(
        { _id },
        {
          $set: {
            profile_picture: url,
          },
        }
      );
    }

    res.status(200).json({ message: "ok!" });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/getLiked/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const myLikes = await User.findOne({ _id }, { _id: 0, liked_products: 1 });
    const prods = await Product.find({
      _id: { $in: [...myLikes.liked_products] },
    });
    res.status(200).json({
      prod_ids: myLikes,
      liked_products: prods,
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/addToCart", auth, async (req, res) => {
  let { _id, item } = req.body;
  _id = mongoose.Types.ObjectId(_id);
  item.product_ID = mongoose.Types.ObjectId(item.product_ID);
  const result = await User.updateOne(
    { _id },
    {
      $push: { "cart.items": item },
      $inc: {
        "cart.total_items": 1,
        "cart.total_cost": item.variant_price * item.qty,
      },
    }
  );
  res.status(200).json({
    status: 200,
    description: "Item added to cart",
    ...result,
  });
});

router.post("/getChat", auth, async (req, res) => {
  try {
    const { _id, profile_info } = req.body;

    let conversation = await Chat.findOneAndUpdate(
      { user_id: _id },
      { user_id: _id, profile_info },
      { new: true, upsert: true }
    );

    res.status(200).json({
      conversation,
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/sendMessage", auth, async (req, res) => {
  try {
    const { _id, profile_info, message } = req.body;

    const sendMessage = await Chat.updateOne(
      { user_id: _id },
      {
        $set: {
          profile_info: profile_info,
          hasNewMessage: true,
        },
        $push: {
          messages: message,
        },
      }
    );

    const conversation = await Chat.findOne({ user_id: _id });

    res.status(201).json({
      message: "sent",
      conversation,
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/removeCancelled", auth, async (req, res) => {
  try {
    const { _id, cancelled } = req.body;

    const removedRecord = await User.updateOne(
      { _id: new ObjectId(_id) },
      {
        $pull: { cancelled: { order_ID: new ObjectId(cancelled.order_ID) } },
      }
    );

    res.status(200).json({
      status: 200,
      description: "Record removed",
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/removeCompleted", auth, async (req, res) => {
  try {
    const { _id, completed } = req.body;

    const removedRecord = await User.updateOne(
      { _id },
      {
        $pull: {
          past_transactions: {
            order_ID: new ObjectId(completed.order_ID),
          },
        },
      }
    );

    res.status(200).json({
      status: 200,
      description: "Record removed",
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/cancelOrder", auth, async (req, res) => {
  try {
    const { _id, order_object, order_ID } = req.body;

    // check if order_ID is still in pending order collection

    const check_pending_order = await Pending_Order.findOne({ order_ID });

    if (!check_pending_order)
      res.status(404).json({
        status: 404,
        description:
          "This order is not in pending, maybe the admin is now processing it or it was already cancelled",
        solution: "We cannot cancel this anymore",
      });

    const delete_pending_order = await Pending_Order.deleteOne({ order_ID });

    const updatedOrderEntry = await Order.updateOne(
      { _id: order_ID },
      {
        $set: {
          order_status: -1,
          reason: "Cancelled by User",
        },
      }
    );

    // if not, just update the user pending_orders

    const updateUserData = await User.updateOne(
      { _id },
      {
        $pull: { pending_orders: { order_ID: new ObjectId(order_ID) } },
        $push: {
          cancelled: {
            ...order_object,
            order_status: -1,
            dat: new Date(),
            reason: "Cancelled by you",
          },
        },
      }
    );

    res.status(200).json({
      status: 200,
      message: "Order Cancelled Successfuly",
    });
  } catch (err) {
    ehandler(e, res);
  }
});

router.post("/placeOrder", auth, async (req, res) => {
  try {
    let { _id, order } = req.body;

    const userData = await User.findOne({ _id });

    if (!userData) {
      return res.status(404).json({
        status: 404,
        description: "User not found",
        solution: "You are not registered in our database",
      });
    }

    const user_order = await Order.create({
      ...order,
      user_ID: new ObjectId(_id),
    });

    const user_pending_order = await Pending_Order.create({
      order_ID: new ObjectId(user_order._id),
      user_ID: new ObjectId(_id),
      user_email: userData.email_address,
      n_items: order.n_items,
      mode_of_payment: order.payment_mode,
      transaction_no: order.transaction_no,
      total_cost: order.total_cost,
      courier: order.courier,
    });

    const newUserData = await User.updateOne(
      { _id },
      {
        $set: {
          cart: {
            total_items: 0,
            total_cost: 0,
            items: [],
          },
        },
        $push: {
          pending_orders: {
            order_ID: new ObjectId(user_order._id),
            total_cost: order.total_cost,
            courier: order.courier.courier_name,
            n_items: order.n_items,
            cat: new Date(),
          },
        },
      }
    );

    res.status(201).json({
      status: 201,
      message: "Order Placed!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/mynumber", auth, async (req, res) => {
  try {
    const { _id, number, mode } = req.body;

    if (mode === 0) {
      const addNumber = await User.updateOne(
        { _id },
        {
          $push: { mobile_numbers: number },
        }
      );
    } else {
      const removeNumber = await User.updateOne(
        { _id },
        {
          $pull: { mobile_numbers: number },
        }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/mynumber", auth, async (req, res) => {
  try {
    const { _id, number, mode } = req.body;

    if (mode === 0) {
      const addNumber = await User.updateOne(
        { _id },
        {
          $push: { mobile_numbers: number },
        }
      );
    } else {
      const removeNumber = await User.updateOne(
        { _id },
        {
          $pull: { mobile_numbers: number },
        }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/mybasics", auth, async (req, res) => {
  try {
    const { _id, user_name, name } = req.body;

    const update = await User.updateOne(
      { _id },
      {
        $set: { user_name, name },
      }
    );

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/mypassword", async (req, res) => {
  try {
    const { _id, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const addNumber = await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword, password_change_date: new Date() },
      }
    );

    // const mailsent = await sendEmail(userEmail, {
    //     name,
    //     user_name,
    //     email_address : userEmail,
    //     password : genPass,
    //     template_name: "YourPassword.html",
    //     subject: "Loft16 Sign Up Email Confirmation",
    //   });
    // }

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/mytwofactorauth", async (req, res) => {
  try {
    const { _id, two_factor_auth } = req.body;

    const update = await User.updateOne(
      { _id },
      {
        $set: { two_factor_auth },
      }
    );

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/myaddress", auth, async (req, res) => {
  try {
    const { _id, address, oldAddress, mode } = req.body;
    if (mode === 0) {
      const addAddress = await User.updateOne(
        { _id },
        {
          $push: { "shipping_address.addresses": address },
        }
      );
    } else if (mode === 1) {
      const removeAddress = await User.updateOne(
        { _id },
        {
          $pull: { "shipping_address.addresses": oldAddress },
        }
      );
      const addAddress = await User.updateOne(
        { _id },
        {
          $push: { "shipping_address.addresses": address },
          $set: { "shipping_address.default_address": 0 },
        }
      );
    } else {
      const removeAddress = await User.updateOne(
        { _id },
        {
          $pull: { "shipping_address.addresses": address },
        }
      );
    }

    const userData = await User.findOne({ _id });

    if (userData.shipping_address.addresses.length === 0)
      await User.updateOne(
        { _id },
        { $set: { "shipping_address.default_address": -1 } }
      );
    else if (userData.shipping_address.default_address < 0)
      await User.updateOne(
        { _id },
        {
          $set: {
            "shipping_address.default_address": 0,
          },
        }
      );

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/changeAvatar", auth, async (req, res) => {
  try {
    const { _id, avatar } = req.body;

    const addNumber = await User.updateOne(
      { _id },
      {
        $set: { profile_picture: avatar },
      }
    );

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/myrecovery", auth, async (req, res) => {
  try {
    const { _id, email, mode } = req.body;

    if (mode === 0) {
      const addEmail = await User.updateOne(
        { _id },
        {
          $push: { recovery_emails: email },
        }
      );
    } else {
      const removeEmail = await User.updateOne(
        { _id },
        {
          $pull: { recovery_emails: email },
        }
      );
    }

    res.status(201).json({
      status: 201,
      message: "Updated!",
    });
  } catch (err) {
    ehandler(err, res);
  }
});

router.post("/updatecart", auth, async (req, res) => {
  try {
    let { _id, cart } = req.body;
    _id = mongoose.Types.ObjectId(_id);

    const result = await User.updateOne(
      { _id },
      {
        $set: {
          cart: cart,
        },
      }
    );
    res.status(200).json({
      status: 200,
      description: "Item removed from cart",
      ...result,
    });
  } catch (e) {
    ehandler(e, res);
  }
});

//remove a specific item from cart
router.post("/removefromcart", auth, async (req, res) => {
  try {
    let { _id, item } = req.body;
    _id = mongoose.Types.ObjectId(_id);
    item.product_ID = mongoose.Types.ObjectId(item.product_ID);
    const itemExist = await User.findOne({ _id }, { cart: 1 }).lean();
    if (itemExist.cart.total_items === 0)
      return res.status(200).json({
        status: 200,
        description: "No item to remove",
      });
    const result = await User.updateOne(
      { _id },
      {
        $pull: { "cart.items": { product_ID: item.product_ID } },
        $inc: {
          "cart.total_items": -1,
          "cart.total_cost": -(item.variant_price * item.qty),
        },
      }
    );
    res.status(200).json({
      status: 200,
      description: "Item removed from cart",
      ...result,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      description: "internal server error",
      solution: "Please contact server admin or try again later",
    });
  }
});

//getUserDetails
router.post("/mydetails/:id", auth, async (req, res) => {
  let _id = req.params.id;
  await snooze(1000);
  if (!_id)
    return res.status(400).json({
      err: 400,
      description: "Missing Required Fields",
      solution: "Please provide required fields",
    });
  _id = mongoose.Types.ObjectId(_id);
  const userData = await User.findOne({ _id }, { password: 0 }).lean();
  if (!userData)
    return res.status(404).json({
      err: 404,
      description: "User not found",
      solution: "User is not registered",
    });
  return res.status(200).json({
    status: "200 : ok 👌",
    userData,
  });
});

//getUserCart
router.post("/mycart/:_id", auth, async (req, res) => {
  let _id = req.params._id;
  // if id is null return 400
  if (!_id)
    return res.status(400).json({
      err: 400,
      description: "Missing Required Fields",
      solution: "Please provide required fields",
    });
  _id = mongoose.Types.ObjectId(_id);
  // get user mycart
  const userCart = await User.findOne({ _id }, { _id: 0, cart: 1 }).lean();
  res.status(200).json(userCart);
});

router.post("/like", auth, async (req, res) => {
  try {
    const { _id, prod_Id, mode } = req.body;

    if (mode === 0) {
      const updateUser = await User.updateOne(
        { _id },
        {
          $push: {
            liked_products: new ObjectId(prod_Id),
          },
        }
      );
      const updateProduct = await Product.updateOne(
        { _id: prod_Id },
        {
          $inc: {
            likes: 1,
          },
        }
      );
    } else {
      const updateUser = await User.updateOne(
        { _id },
        {
          $pull: {
            liked_products: new ObjectId(prod_Id),
          },
        }
      );
      const updateProduct = await Product.updateOne(
        { _id: prod_Id },
        {
          $inc: {
            likes: -1,
          },
        }
      );
    }

    res.status(200).json({
      message: "ok!",
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/writeComment", auth, async (req, res) => {
  try {
    const { user_Id, prod_Id, comment_object } = req.body;

    const writeComment = await Product.updateOne(
      {
        _id: prod_Id,
      },
      {
        $push: {
          ratings: comment_object,
        },
        $inc: {
          n_ratings: comment_object.rating,
          n_no_ratings: 1,
        },
      }
    );

    const updateUser = await User.updateOne(
      {
        _id: user_Id,
      },
      {
        $pull: {
          to_rate: new ObjectId(prod_Id),
        },
      }
    );

    res.status(200).json({
      message: "ok!",
    });
  } catch (e) {
    ehandler(e, res);
  }
});

router.post("/orderDetails", auth, async (req, res) => {
  try {
    const { order_ID } = req.body;

    const details = await Order.aggregate([
      {
        $match: { _id: new ObjectId(order_ID) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_ID",
          foreignField: "_id",
          as: "user_profile",
        },
      },
      { $unwind: "$user_profile" },
    ]);

    res.status(200).json({
      message: "ok!",
      details: details.length !== 0 ? details[0] : {},
    });
  } catch (err) {
    ehandler(err, res);
  }
});

module.exports = router;
