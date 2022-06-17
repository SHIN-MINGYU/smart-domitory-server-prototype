const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const { sequelize } = require("./models");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config;
const SequelizeStore = require("connect-session-sequelize")(session.Store); // 시퀄라이저 DB연동
// 모바일 라우터
const authRouter = require("./routes/auth");
const asRouter = require("./routes/asApp");
const bulletRouter = require("./routes/bulletinApp");
const busRouter = require("./routes/busApp");
const hlthRouter = require("./routes/hlthApp");
const stayoutRouter = require("./routes/stayoutApp");
const signUpRouter = require("./routes/signUp");
const commentRouter = require("./routes/comment");
const busInfoAppRouter = require("./routes/busInfoApp");
const hotAppRouter = require("./routes/hotApp");
// 웹 라우터
const agreeAdminRouter = require("./routes/agree");
const asAdminRouter = require("./routes/asAdmin");
const busAdminRouter = require("./routes/busAdmin");
const busInfoAdminRouter = require("./routes/busInfoAdmin");
const hlthAdminRouter = require("./routes/hlthAdmin");
const holidayAdminRouter = require("./routes/holidayAdmin");
const menuAdminRouter = require("./routes/menu");
const stayoutAdminRouter = require("./routes/stayoutAdmin");

const app = express();

app.set("port", process.env.PORT || 3001);
sequelize
  .sync({ force: !true })
  // .sync({ force: true }) true시 테이블 새로 생성됨!
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  session({
    secret: process.env.COOKIE || "!@#!ASDASD!EWQE!@#",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600 * 60 * 24,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ credentials: true, origin: true }));
/* app.use(cookieParser(process.env.COOKIE || "!@#!ASDASD!EWQE!@#")); */
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// 라우터
// 모바일 앱
app.use("/auth", authRouter); // 로그인
app.use("/bulletin", bulletRouter); // 게시글
app.use("/bus", busRouter);
app.use("/as", asRouter);
app.use("/hlth", hlthRouter);
app.use("/stayout", stayoutRouter);
app.use("/signup", signUpRouter);
app.use("/comment", commentRouter);
app.use("/businfo", busInfoAppRouter);
app.use("/hot", hotAppRouter);
// 관리자 웹

// 관리자 예약관리
app.use("/admin/as", asAdminRouter); // A/S
app.use("/admin/hlth", hlthAdminRouter); // 헬스
app.use("/admin/stayout", stayoutAdminRouter); // 외박
app.use("/admin/bus", busAdminRouter); // 셔틀 버스

// 관리자 생활관 관리
app.use("/admin/menu", menuAdminRouter); // 식단표
app.use("/admin/businfo", busInfoAdminRouter); // 버스 시간표
app.use("/admin/holiday", holidayAdminRouter); // 휴일
app.use("/admin/agree", agreeAdminRouter); // 사용자 회원인증

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error =
//     process.env.NODE_ENV !== 'production' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
