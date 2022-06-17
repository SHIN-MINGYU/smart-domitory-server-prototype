const express = require("express");
const { Op } = require("sequelize");
const { Sequelize } = require("../models");
const BusInfo = require("../models/bus_info");
const router = express.Router();

// 셔틀 버스 관리
// 사이트 내용, DB 재 검토 필요
//'http://localhost:3001/businfo'

router.post("/", async (req, res, next) => {
  try {
    // bus_info, UI 조정 필요할것 같음
    // 아래 임시 코드
    const data = await BusInfo.findAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/availableBusStop", async (req, res, next) => {
  try {
    // bus_info, UI 조정 필요할것 같음
    // 아래 임시 코드
    const type = req.body.type;
    const bus_date = req.body.bus_date;
    const data = await BusInfo.findAll({
      attributes: ["bus_stop", "bus_id"],
      where: { type, bus_date },
      group: ["bus_stop"],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/availableTime", async (req, res, next) => {
  try {
    const type = req.body.type;
    const bus_date = req.body.bus_date;
    const bus_stop = req.body.bus_stop;
    const data = await BusInfo.findAll({
      attributes: ["bus_time", "bus_id"],
      where: { type, bus_date, bus_stop },
    });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
