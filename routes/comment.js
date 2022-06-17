const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

//댓글만들기 "http://localhost:3001/comment/create_process"
router.post("/create", async (req, res) => {
  if (!req.user) {
    return;
  }
  try {
    await Comment.create({
      content: req.body.content,
      create_date: new Date(),
      std_id: req.user.id,
      bulletin_id: req.body.bulletin_id,
    });
    return res.send("success").status(200);
  } catch (err) {
    return res.status(404).send("NOT FOUND");
  }
});

//댓글 조회 "http://localhost:3001/comment/inquery"
router.post("/inquery", async (req, res) => {
  try {
    const data = await Comment.findAndCountAll({
      where: {
        bulletin_id: req.body.bulletin_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).send("NOT FOUND");
  }
});

router.delete("/delete", async (req, res, next) => {
  try {
    await Comment.destroy({
      where: {
        comment_id: req.body.comment_id,
      },
    });
    return res.status(200).send("success");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
