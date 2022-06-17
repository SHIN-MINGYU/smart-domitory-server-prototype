const express = require("express");
const { Op, NOW } = require("sequelize");
const StayoutRequest = require("../models/stayout_request");
const StdInfo = require("../models/std_info");
const router = express.Router();
const moment = require("moment");

//'http://localhost:3001/admin/stayout' = '/'

// 외박 조회
//'http://localhost:3001/admin/stayout'
router.post("/", async (req, res, next) => {
  try {
    let Id = req.body.std_id;
    let Name = req.body.std_name;
    /*     let Date = req.body.date; */
    let page = req.body.nowPage;
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    /*     Date = Date || { [Op.ne]: null }; */
    if (!page) {
      page = 1;
    }
    const data = await StayoutRequest.findAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id,
            std_name: Name,
          },
        },
      ],

      order: [["stayout_id", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/pagenum", async (req, res, next) => {
  try {
    let Id = req.body.std_id;
    let Name = req.body.std_name;
    /*     let Date = req.body.date; */
    Id = Id || { [Op.ne]: null };
    Name = Name || { [Op.ne]: null };
    const data = await StayoutRequest.findAndCountAll({
      include: [
        {
          model: StdInfo,
          where: {
            std_id: Id,
            std_name: Name,
          },
        },
      ],
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/people/date", async (req, res, next) => {
  try {
    const dataArr = [];
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    for (let i = 0; i < 31; i++) {
      const data = await StayoutRequest.findAndCountAll({
        where: {
          start_date: {
            [Op.lte]: moment(now),
          },

          end_date: {
            [Op.gte]: moment(now),
          },
        },
      });
      now.setDate(now.getDate() + 1);
      dataArr.push(data);
    }
    return res.status(200).send(dataArr);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
