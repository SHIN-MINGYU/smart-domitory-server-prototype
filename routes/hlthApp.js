const express = require("express");
const { Op } = require("sequelize");
const HlthRequest = require("../models/hlth_request");
const moment = require("moment");
const router = express.Router();

// 'http://localhost:3001/hlth' = '/'

// 헬스 조회
// 학번으로 날짜, 시작시간, 종료시간 조회 후 PK 순으로 정렬
// 'http://localhost:3001/hlth/inquire'
router.post("/inquire", async (req, res, next) => {
  try {
    const data = await HlthRequest.findAll({
      where: { std_id: req.user.id },
      order: [["hlth_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const data = await HlthRequest.findAll({
      where: {
        std_id: req.user.id,
        [Op.and]: [
          { date: { [Op.gte]: moment(req.body.startDate).toISOString() } },
          { date: { [Op.lte]: moment(req.body.endDate) } },
        ],
      },
      order: [["hlth_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 헬스 신청
// 'http://localhost:3001/hlth/create'
router.post("/create", async (req, res, next) => {
  try {
    await HlthRequest.create({
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      std_id: req.user.id,
    });

    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/* // 'http://localhost:3001/hlth/update'
// PK, 학번으로 수정
router.patch("/update", async (req, res, next) => {
  try {
    const data = await HlthRequest.update({
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      where: {
        std_id: req.body.std_id,
        hlth_id: req.body.hlth_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
}); */

// 'http://localhost:3001/hlth/delete'
// PK, 학번으로 삭제
router.delete("/delete", async (req, res, next) => {
  try {
    const data = await HlthRequest.destroy({
      where: {
        hlth_id: req.body.hlth_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
