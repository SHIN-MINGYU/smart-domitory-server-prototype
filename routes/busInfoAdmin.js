const express = require("express");
const { Op } = require("sequelize");
const { Sequelize } = require("../models");
const BusInfo = require("../models/bus_info");
const router = express.Router();

//'http://localhost:3001/admin/businfo' = '/'

// 셔틀 버스 조회
//'http://localhost:3001/admin/businfo'
router.post("/", async (req, res, next) => {
  try {
    // bus_info, UI 조정 필요할것 같음
    // 아래 임시 코드
    const data = await BusInfo.findAll({
      where: {
        bus_date: req.body.bus_date,
        type: req.body.type,
      },
      order: [["bus_times", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 셔틀 버스 수정
//'http://localhost:3001/admin/businfo'
router.patch("/", async (req, res, next) => {
  try {
    const data = await BusInfo.update(
      {
        bus_time: req.body.bus_time,
      },
      {
        where: {
          bus_date: req.body.bus_date,
          type: req.body.type,
          bus_id: req.body.bus_id,
        },
      }
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 셔틀 버스 등록
//'http://localhost:3001/admin/businfo/create'
router.post("/create", async (req, res, next) => {
  console.log(req.body);
  try {
    const data = await BusInfo.create({
      bus_date: req.body.bus_date,
      bus_stop: req.body.bus_stop,
      bus_time: req.body.bus_time,
      bus_times: req.body.bus_times,
      type: req.body.type,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 셔틀 버스 삭제
//'http://localhost:3001/admin/businfo'
router.delete("/", async (req, res, next) => {
  try {
    const data = await BusInfo.destroy({
      where: {
        bus_id: req.body.bus_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
