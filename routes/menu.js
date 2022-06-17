const express = require("express");
const moment = require("moment");
const { Op } = require("sequelize");
const MenuList = require("../models/menu_list");
const router = express.Router();

//'http://localhost:3001/admin/menu' = '/'

// 식단표 조회
//'http://localhost:3001/admin/menu'
router.post("/", async (req, res, next) => {
  try {
    let StartDate = req.body.startDate;
    let EndDate = req.body.endDdate;
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-19";
    console.log(StartDate, EndDate);
    const data = await MenuList.findAll({
      where: {
        date: {
          [Op.between]: [StartDate, EndDate],
        },
      },
      order: [["date", "DESC"]],
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
    let StartDate = req.body.startDate;
    let EndDate = req.body.endDate;
    StartDate = StartDate || "1970-01-01";
    EndDate = EndDate || "2038-01-19";
    const data = await MenuList.findAndCountAll({
      where: {
        date: {
          [Op.between]: [StartDate, EndDate],
        },
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/app", async (req, res, next) => {
  try {
    const startNow = new Date();
    const endNow = new Date();
    const startDay = startNow.getDate() - startNow.getDay();
    const endDay = endNow.getDate() + (6 - endNow.getDay());
    startNow.setDate(startDay);
    endNow.setDate(endDay);
    const startDate = startNow;
    const endDate = endNow;
    const data = await MenuList.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["date", "ASC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/exist", async (req, res, next) => {
  try {
    const data = await MenuList.findOne({
      where: {
        date: moment(req.body.date),
      },
    });
    if (data === null) {
      return res.status(200).send(false);
    }
    return res.status(200).send(true);
  } catch (err) {
    next(err);
  }
});

// 식단표 수정
//'http://localhost:3001/admin/menu'
router.patch("/", async (req, res, next) => {
  try {
    const data = await MenuList.update(
      {
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
      },
      {
        where: {
          date: moment(req.body.date),
        },
      }
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 식단표 등록
//'http://localhost:3001/admin/menu/create'
router.post("/create", async (req, res, next) => {
  try {
    const data = await MenuList.create({
      date: req.body.date,
      breakfast: req.body.breakfast,
      lunch: req.body.lunch,
      dinner: req.body.dinner,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 식단표 삭제
//'http://localhost:3001/admin/menu'
router.delete("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await MenuList.destroy({
      where: {
        date: req.body.date,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
