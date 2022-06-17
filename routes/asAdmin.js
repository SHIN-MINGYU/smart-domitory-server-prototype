const express = require("express");
const { Op } = require("sequelize");
const AsRequest = require("../models/as_request");
const StdInfo = require("../models/std_info");
const moment = require("moment");
const router = express.Router();

//'http://localhost:3001/admin/as' = '/'

// A/S 신청 조회
//'http://localhost:3001/admin/as'
router.post("/", async (req, res, next) => {
  try {
    let Id = req.body.std_id;
    let Name = req.body.std_name;
    let StartDate = req.body.start_date;
    let EndDate = req.body.end_date;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-01";
    const data = await AsRequest.findAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id || { [Op.ne]: null },
            std_name: Name || { [Op.ne]: null },
          },
        },
      ],
      where: {
        request_date: {
          [Op.gte]: moment(StartDate).toISOString(),
          [Op.lte]: moment(EndDate),
        },
        repair_date: null,
      },
      limit: 10,
      offset: req.body.nowPage ? (req.body.nowPage - 1) * 10 : 0,
      order: [["as_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// A/S 처리 확인
//'http://localhost:3001/admin/as/checked'
router.patch("/checked", async (req, res, next) => {
  try {
    let Id = req.body.id;
    await AsRequest.update(
      { repair_date: Date.now() },
      {
        where: { as_id: Id },
      }
    );
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/pagenum", async (req, res, next) => {
  try {
    let Id = req.body.std_id;
    let Name = req.body.std_name;
    let StartDate = req.body.start_date;
    let EndDate = req.body.end_date;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-19";
    const data = await AsRequest.findAndCountAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id || { [Op.ne]: null },
            std_name: Name || { [Op.ne]: null },
          },
        },
      ],
      where: {
        request_date: {
          [Op.gte]: moment(StartDate).toISOString(),
          [Op.lte]: moment(EndDate),
        },
        repair_date: null,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
