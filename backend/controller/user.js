const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { errorHandler } = require("../utils/error");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.gettest = async (req, res) => {
  res.json({
    status: "high",
  });
};

exports.verifyUser = (req, res, next) => {
  console.log("acha");
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(500, "Token not recieved"));
  }

  jwt.verify(token, process.env.JWT, (err, userID) => {
    if (err) next(errorHandler(500, "You can not change another User Detail"));
    req.userID = userID;
    next();
  });
};

exports.updateUser = async (req, res, next) => {
  if (req.userID.id !== req.params.id) {
    return next(errorHandler(500, "You can not change another User Detail"));
  }

  try {
    const { formData } = req.body;
    const newformData = JSON.parse(formData);
    const files = req.files;

    if (files) {
      const file = req.files.file;
      const fileName = file.name.toLowerCase();

      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg")
      ) {
        const options = { folder: "trying" };
        const response = await cloudinary.uploader.upload(
          file.tempFilePath,
          options
        );
        newformData.photo = response.secure_url;
      }
    }

    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          phone: newformData.Phone,
          photo: newformData.photo,
        },
      },
      { new: true }
    );

    const { password, ...sendData } = updatedUser._doc;

    res.json({
      status: true,
      payload: sendData,
    });
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Some error occured"));
  }
};

exports.deleteIt = async (req, res, next) => {
  try {
    if (req.params.id !== req.userID.id) {
      return next(errorHandler(500, "You can not delete another User Detail"));
    }
    await user.findByIdAndDelete(req.params.id);
    console.log("delete hogya hai");
    res.json({
      status: true,
    });
  } catch (err) {
    next(errorHandler(500, "Some error occured"));
  }
};

// in sign out just removed the cookie
exports.signout = (req, res) => {
  console.log("angain brp");
  res
    .clearCookie("token")
    .status(200)
    .json({ status: true, message: "hat gya" });
};

// exports.forget = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const validUser = await user.findOne({ email });
//     if (!validUser) {
//       return next(errorHandler(500, "Email is incorrect"));
//     }
//     const validotp = await user.findOne({ email });
//     if (validotp) {
//       console.log("het");
//       await OTP.findOneAndDelete({ email });
//     }
//     const value = Math.floor(1000 + Math.random() * 9000);
//     const otpData = await OTP.create({
//       email,
//       value,
//       expiration_time: new Date(Date.now() + 10 * 60000),
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.log(err);
//     next(errorHandler(500, "Error occured"));
//   }
// };

// exports.changePass = async (req, res, next) => {
//   try {
//     const { email, value } = req.body;

//     const validOtp = await OTP.findOne({ email, value });

//     if (!validOtp) {
//       console.log("valid nhi hai");
//       return next(errorHandler(500, "OTP Is Incorrect"));
//     }
//     const currentTime = new Date();
//     if (currentTime > validOtp.expiration_time) {
//       return next(errorHandler(500, "Time Limit Exceeded"));
//     }
//     console.log("pass");
//     res.json({ success: true });
//   } catch (err) {
//     next(errorHandler(500, "Error Occured"));
//   }
// };

exports.forget = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);

    const validUser = await user.findOne({ email });
    if (!validUser) {
      return next(errorHandler(500, "Email is incorrect"));
    }
    const payload = {
      email,
      id: validUser._id,
    };
    const OneTimePassChangeSecret = process.env.JWT + validUser.password;

    const token = jwt.sign(payload, OneTimePassChangeSecret, {
      expiresIn: "15m",
    });

    const link = `http://localhost:3000/api/user/changePass/${validUser._id}/${token}`;
    console.log(link);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: "mailHandl3er",
      to: email,
      subject: "Reset Password ",
      html: `<h3>Reset your Password With This Link</h3> <p>${link}</p>`,
    });
    console.log(info);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Error occured here"));
  }
};

exports.changePass = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const validUser = await user.findOne({ _id: id });
    if (!validUser) {
      return next(errorHandler(500, "Unknown user"));
    }
    const OneTimePassChangeSecret = process.env.JWT + validUser.password;

    const data = jwt.verify(token, OneTimePassChangeSecret);
    res.render("changePass", { email: validUser.email });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};
exports.changePassInDB = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const validUser = await user.findOne({ _id: id });
    if (!validUser) {
      return next(errorHandler(500, "Unknown user"));
    }
    const OneTimePassChangeSecret = process.env.JWT + validUser.password;
    const data = jwt.verify(token, OneTimePassChangeSecret);
    const { email } = data;
    const changeNow = await user.findOne({ _id: id, email });
    if (!changeNow) {
      return next(errorHandler(500, "Changes in Token"));
    }
    const hashedpassword = bcryptjs.hashSync(password, 10);
    const updatedUser = await user.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedpassword,
        },
      },
      { new: true }
    );
    res.send(
      "The Password has been changed successfully. You may now log in with your updated credentials"
    );
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};
