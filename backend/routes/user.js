const express = require("express");

const {
  gettest,
  updateUser,
  verifyUser,
  deleteIt,
  forget,
  changePass,
  changePassInDB,
} = require("../controller/user");
const { verify } = require("jsonwebtoken");

const router = express.Router();

router.get("/text", gettest);
router.post("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteIt);
router.post("/forget", forget);
router.get("/changePass/:id/:token", changePass);
router.post("/changePass/:id/:token", changePassInDB);

module.exports = router;
