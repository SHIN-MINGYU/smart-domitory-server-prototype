const express = require("express");
const { Op } = require("sequelize");
const AsRequest = require("../models/as_request");
const StdInfo = require("../models/std_info");
const router = express.Router();

// 'http://localhost:3001/as' = '/'

// 모바일 a/s 조회
// 신청날짜, 제목 (추후에 수정 예정), 상태, 수리일자 조회
// 'http://localhost:3001/as/inquery'
router.post("/inquery", async (req, res, next) => {
  try {
    const data = await AsRequest.findAll({
      where: { std_id: req.user.id },
      order: [["as_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const data = await AsRequest.findAll({
      where: {
        std_id: req.user.id,
        [Op.and]: [
          {
            request_date: {
              [Op.gte]: moment(req.body.startDate).toISOString(),
            },
          },
          { request_date: { [Op.lte]: moment(req.body.endDate) } },
        ],
      },
      order: [["as_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 A/S 신청
// 'http://localhost:3001/as/create'
router.post("/create", async (req, res, next) => {
  try {
    await AsRequest.create({
      title: req.body.title,
      content: req.body.content,
      request_date: Date.now(),
      vst_check: req.body.vst_check,
      std_id: req.user.id,
    });
    return res.status(200).send("create success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 a/s 수정
// PK, 학번으로 수정
// 'http://localhost:3001/as/update'
router.patch("/update", async (req, res, next) => {
  try {
    console.log(req.body);
    await AsRequest.update(
      {
        title: req.body.title,
        content: req.body.content,
        vst_check: req.body.vst_check,
        request_date: new Date(),
      },
      {
        where: {
          std_id: req.user.id,
          as_id: req.body.as_id,
        },
      }
    );
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 a/s 삭제
// PK, 학번으로 삭제
// 'http://localhost:3001/as/delete'
router.delete("/delete", async (req, res, next) => {
  try {
    const data = await AsRequest.destroy({
      where: {
        as_id: req.body.as_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
