const express = require("express");
const { Op, fn, col } = require("sequelize");
const StdInfo = require("../models/std_info");
const BusRequest = require("../models/bus_request");
const moment = require("moment");
const router = express.Router();

//'http://localhost:3001/admin/bus' = '/'

// 셔틀 버스 예약자 조회
//'http://localhost:3001/admin/bus'
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body.nowPage);
    let Id = req.body.stdId;
    let Name = req.body.stdName;
    let BusStop = req.body.busStop;
    let BusDate = req.body.date;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    BusStop = BusStop || { [Op.ne]: null };
    BusDate = BusDate || { [Op.ne]: null };
    const data = await BusRequest.findAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id,
            std_name: Name,
          },
        },
      ],
      where: {
        bus_date: BusDate,
        bus_stop: BusStop,
      },
      order: [["bus_req_id", "DESC"]],
      limit: 10,
      offset: (req.body.nowPage - 1) * 10,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/pagenum", async (req, res, next) => {
  try {
    let Id = req.body.stdId;
    let Name = req.body.stdName;
    let BusStop = req.body.busStop;
    let BusDate = req.body.date;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    BusStop = BusStop || { [Op.ne]: null };
    BusDate = BusDate || { [Op.ne]: null };
    const data = await BusRequest.findAndCountAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id,
            std_name: Name,
          },
        },
      ],
      where: {
        bus_date: BusDate,
        bus_stop: BusStop,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/inquire", async (req, res, next) => {
  try {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    const data = await BusRequest.findAll({
      attributes: [
        "bus_date",
        "bus_time",
        [fn("COUNT", col("bus_req_id")), "people_count"],
      ],
      where: {
        bus_stop: req.body.type ? "복현캠퍼스" : "글로벌생활관",
        bus_date: {
          [Op.lte]: moment(now).toISOString(),
        },
      },
      group: ["bus_date", "bus_time"],
      raw: true,
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
