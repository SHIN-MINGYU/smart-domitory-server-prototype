const express = require('express');
const { Op } = require('sequelize');
const Holiday = require('../models/holiday');
const router = express.Router();

// 휴일 관리/ 조회
//'http://localhost:3001/admin/holiday'
router.post('/', async (req, res, next) => {
  try {
    let Name = req.body.name;
    let Date = req.body.date;
    Name = Name || { [Op.ne]: null };
    Date = Date || { [Op.ne]: null };
    // 아래 임시 코드
    const data = await Holiday.findAll({
      where: {
        name: Name,
        date: Date,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 휴일 관리/ 추가
//'http://localhost:3001/admin/holiday/create'
router.post('/create', async (req, res, next) => {
  try {
    const data = await Holiday.create({
      name: req.body.name,
      date: req.body.date,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 휴일 관리/ 삭제
//'http://localhost:3001/admin/holiday'
router.delete('/', async (req, res, next) => {
  try {
    const data = await Holiday.destroy({
      where: {
        holiday_id: req.body.id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
