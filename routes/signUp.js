const express = require("express");
const router = express.Router();
const StdWait = require("../models/std_wait");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "naver",
  auth: {
    user: "smg20004@naver.com",
    //비밀번호 입력하세욤
    pass: "@tlsalsrb123",
  },
});

// 모바일 회원 가입
//'http://localhost:3001/signup' = /
router.post("/", async (req, res, next) => {
  try {
    const hash = crypto.randomBytes(10).toString("hex");
    const mailOptions = {
      from: "smg20004@naver.com",
      to: req.body.e_mail,
      subject: "hello",
      text: "Authification http://localhost:3001/auth/" + hash,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await StdWait.create({
      std_id: req.body.std_id,
      std_name: req.body.std_name,
      password: req.body.password,
      ph_num: req.body.ph_num,
      room_num: req.body.room_num,
      e_mail: req.body.e_mail,
      hash: hash,
    });
    return res.status(200).send("success");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
