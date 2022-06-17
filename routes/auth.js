const express = require("express");
const StdInfo = require("../models/std_info");
const AdmInfo = require("../models/adm_info");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const StdWait = require("../models/std_wait");
//'http://localhost:3001/auth' = /
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "naver",
  auth: {
    user: "smg20004@naver.com",
    //비밀번호 입력하세욤
    pass: "@tlsalsrb123",
  },
});

router.get("/:hash", async (req, res, next) => {
  try {
    const hash = req.params.hash;
    const data = await StdWait.findAll({
      raw: true,
      where: {
        hash: hash,
      },
    });
    const Id = data[0]["std_id"];
    const Name = data[0]["std_name"];
    const Pnum = data[0]["ph_num"];
    const Rnum = data[0]["room_num"];
    const Email = data[0]["e_mail"];
    const Pw = data[0]["password"];
    if (data.length === 0) {
      console.log("잘못된 해쉬 입력");
    } else {
      StdInfo.create({
        std_id: Id,
        std_name: Name,
        ph_num: Pnum,
        room_num: Rnum,
        e_mail: Email,
        password: Pw,
      });
      StdWait.destroy({
        where: { hash: hash },
      });
    }
    return res.redirect("http://localhost:19006/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

passport.use(
  "local:user",
  new LocalStrategy({ session: true }, async (username, password, cb) => {
    try {
      const data = await StdInfo.findOne({
        attributes: ["std_id", "std_name", "password", "access"],
        where: { std_id: username },
      });
      if (!data) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      } else if (password != data.password) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      } else {
        if (!data.access) {
          return cb(null, false, { message: "access denied" });
        }
        data.dataValues.id = data.dataValues.std_id;
        data.dataValues.name = data.dataValues.std_name;
        delete data.dataValues.std_id;
        delete data.dataValues.std_name;
        return cb(null, data.dataValues);
      }
    } catch (e) {
      return cb(e);
    }
  })
);

passport.use(
  "local:admin",
  new LocalStrategy({ session: true }, async (username, password, cb) => {
    try {
      const data = await AdmInfo.findOne({
        attributes: ["adm_id", "adm_name", "password"],
        where: { adm_id: username },
      });
      console.log(data);
      if (!data) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      } else if (password != data.password) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }

      data.dataValues.id = data.dataValues.adm_id;
      data.dataValues.name = data.dataValues.adm_name;
      delete data.dataValues.adm_id;
      delete data.dataValues.adm_name;
      return cb(null, data.dataValues);
    } catch (e) {
      return cb(e);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log("Desealize : ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});
// 모바일 로그인
//'http://localhost:3001/auth/login'
router.post("/login", (req, res, next) => {
  passport.authenticate("local:user", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    } else if (info) {
      return next(info);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const filteredUser = Object.assign({}, user);
      delete filteredUser.password;

      return res.json(filteredUser);
    });
  })(req, res, next);
});

router.post("/admin/login", (req, res, next) => {
  passport.authenticate("local:admin", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    } else if (info) {
      return next(info);
    }

    return req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const filteredUser = Object.assign({}, user);
      delete filteredUser.password;
      return res.json(filteredUser);
    });
  })(req, res, next);
});

router.post("/logout", async (req, res, next) => {
  /* const sid = req.body.sessionId; */
  req.logout((err) => {
    if (err) {
      next(err);
    }
  });
  req.session.destroy();

  return res.status(200).send("success");
});
router.post("/userCheck", (req, res, next) => {
  if (req.user) {
    return res.send(true);
  } else {
    req.session.destroy();
    return res.send(false);
  }
});
// 모바일 비밀번호 찾기
router.post("/find/pw", async (req, res, next) => {
  try {
    // 학번, 나이 입력후 본인확인이 가능한 것(문자인증, 이메일인증) 으로
    // 본인인증이 되면 새 비밀번호로 변경
    const mailOptions = {
      from: "smg20004@naver.com",
      to: req.body.e_mail,
      subject: "hello",
      text: `이메일 인증 코드 ${req.body.hash}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/chagne/pw", async (req, res, next) => {
  try {
    await StdInfo.update(
      {
        password: req.body.password,
      },
      {
        where: {
          e_mail: req.body.e_mail,
        },
      }
    );
    return res.status(200).send("success");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
