const express = require("express");
const { Op } = require("sequelize");
const HlthRequest = require("../models/hlth_request");
const StdInfo = require("../models/std_info");
const moment = require("moment");
const router = express.Router();

//'http://localhost:3001/admin/hlth' = '/'

// 헬스 예약자 조회
//'http://localhost:3001/admin/hlth'
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    let Id = req.body.stdId;
    let Name = req.body.stdName;
    let StartDate = req.body.startDate;
    let EndDate = req.body.endDate;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-01";
    const data = await HlthRequest.findAll({
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
        std_id: Id,
        date: {
          [Op.gte]: moment(StartDate).toISOString(),
          [Op.lte]: moment(EndDate),
        },
      },
      order: [["hlth_id", "DESC"]],
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
    let StartDate = req.body.startDate;
    let EndDate = req.body.endDate;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-01";
    const data = await HlthRequest.findAndCountAll({
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
        std_id: Id,
        date: {
          [Op.gte]: moment(StartDate).toISOString(),
          [Op.lte]: moment(EndDate),
        },
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
