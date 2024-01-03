const user = require("../models/user");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  //   console.log(req.body);
  //   data mil gya usse db me save krna

  try {
    const { username, email, password, phone } = req.body;
    const hashedpasswaor = bcryptjs.hashSync(password, 10);

    const data = await user.create({
      username,
      email,
      password: hashedpasswaor,
      phone,
    });
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      const duplicateKey = Object.keys(err.keyPattern)[0];
      const duplicateValue = err.keyValue[duplicateKey];

      next(
        errorHandler(
          err.statusCode,
          ` The ${duplicateKey} '${duplicateValue}' is already in use.`
        )
      );
    }
    next(errorHandler(500, "Error"));
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User Is Not Available"));

    validPass = bcryptjs.compareSync(password, validUser.password);

    if (!validPass)
      return next(errorHandler(404, "Username and Password Does Not Match"));

    const { password: userPass, ...sendData } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT);

    const expiryDate = new Date((Date.now() / 1000 + 60 * 60 * 24 * 10) * 1000);
    // const expiryDate = new Date((Date.now() / 1000 + 60) * 1000);
    res
      .cookie("token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ status: true, sendData });
  } catch (err) {
    next(err);
  }
};

exports.google = async (req, res) => {
  const { name, email, photo } = req.body;
  const validUser = await user.findOne({ email });

  if (validUser) {
    const token = jwt.sign({ id: validUser.id }, process.env.JWT);
    const { password, ...sendData } = validUser._doc;
    const expiryDate = new Date((Date.now() / 1000 + 60 * 60 * 24) * 1000);
    res
      .cookie("token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ status: true, sendData });
  } else {
    const password = Math.random().toString(36).slice(-8);
    const hashedpasswaor = bcryptjs.hashSync(password, 10);
    const newUser = await user.create({
      username: name,
      email,
      password: hashedpasswaor,
      photo,
    });

    const { password: newPass, ...sendData } = newUser._doc;
    const token = jwt.sign({ id: newUser._id }, process.env.JWT);

    const expiryDate = new Date((Date.now() / 1000 + 60 * 60 * 24) * 1000);
    console.log("thi one bro");
    res
      .cookie("token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        status: true,
        sendData,
      });
  }
};
