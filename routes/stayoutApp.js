const express = require("express");
const { Op } = require("sequelize");
const StayoutRequest = require("../models/stayout_request");
const moment = require("moment");
const router = express.Router();

//'http://localhost:3001/stayout' == '/'

// 모바일 외박 조회
// 'http://localhost:3001/stayout/inquirey'
// 학번으로 시작일, 종료일 조회 후 PK 순으로 정렬
router.post("/inquire", async (req, res, next) => {
  try {
    const data = await StayoutRequest.findAll({
      where: { std_id: req.user.id },
      order: [["stayout_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await StayoutRequest.findAll({
      where: {
        std_id: req.user.id,
        [Op.and]: [
          { start_date: { [Op.lte]: moment(req.body.startDate) } },
          { end_date: { [Op.gte]: moment(req.body.startDate) } },
        ],
      },
      order: [["stayout_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 외박 신청
// 'http://localhost:3001/stayout/create'
router.post("/create", async (req, res, next) => {
  try {
    await StayoutRequest.create({
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      std_id: req.user.id,
    });

    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 외박 수정
// 'http://localhost:3001/stayout/update'
// PK, 학번으로 수정
router.patch("/update", async (req, res, next) => {
  try {
    const data = await StayoutRequest.update({
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      where: {
        std_id: req.body.std_id,
        stayout_id: req.body.stayout_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 외박 삭제
// 'http://localhost:3001/stayout/delete'
// PK, 학번으로 삭제
router.delete("/delete", async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await StayoutRequest.destroy({
      where: {
        stayout_id: req.body.stayout_id,
      },
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
