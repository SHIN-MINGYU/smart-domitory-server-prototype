const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const Bulletin = require("../models/bulletin");
const Hot = require("../models/hot");
router.post("/inquire", async (req, res) => {
  try {
    const data = await Hot.findAll({
      include: [
        {
          model: Bulletin,
        },
      ],
      where: { bulletin_id: { [Op.ne]: null } },
      order: [["hot_id", "DESC"]],
    });
    const sendData = data.map((el) => el.dataValues.Bulletin);
    res.status(200).json(sendData);
  } catch (err) {
    console.log(err);
    res.status(404).send("failed");
  }
});

module.exports = router;
