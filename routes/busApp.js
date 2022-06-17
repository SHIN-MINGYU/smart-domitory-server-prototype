const express = require("express");
const { Op } = require("sequelize");
const moment = require("moment");
const BusRequest = require("../models/bus_request");
const router = express.Router();

// 'http://localhost:3001/bus' = '/'

// 모바일 셔틀버스 조회
// 'http://localhost:3001/bus/inquire'
// 학번으로 날짜, 탑승 정류장, 시간 조회 후 PK 순으로 정렬
router.post("/inquire", async (req, res, next) => {
  try {
    const data = await BusRequest.findAll({
      where: {
        std_id: req.user.id,
      },
      order: [["bus_req_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const data = await BusRequest.findAll({
      where: {
        std_id: req.user.id,
        [Op.and]: [
          { bus_date: { [Op.gte]: moment(req.body.startDate).toISOString() } },
          { bus_date: { [Op.lte]: moment(req.body.endDate) } },
        ],
      },
      order: [["bus_req_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 셔틀버스 신청
//'http://localhost:3001/bus/create'
router.post("/create", async (req, res, next) => {
  try {
    await BusRequest.create({
      bus_date: req.body.bus_date,
      bus_way: req.body.bus_way,
      bus_stop: req.body.bus_stop,
      bus_time: req.body.bus_time,
      std_id: req.user.id,
    });

    return res.status(200).send("create success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 셔틀버스 수정
// 'http://localhost:3001/bus/update'
// PK, 학번으로 수정
router.patch("/update", async (req, res, next) => {
  try {
    const data = await BusRequest.update(
      {
        bus_date: req.body.bus_date,
        bus_way: req.body.bus_way,
        bus_stop: req.body.bus_stop,
        bus_time: req.body.bus_time,
      },
      {
        where: {
          bus_req_id: req.body.bus_req_id,
          std_id: req.user.id,
        },
      }
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 모바일 셔틀버스 삭제
// 'http://localhost:3001/bus/delete'
// PK, 학번으로 삭제
router.delete("/delete", async (req, res, next) => {
  try {
    const data = await BusRequest.destroy({
      where: {
        bus_req_id: req.body.bus_req_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
