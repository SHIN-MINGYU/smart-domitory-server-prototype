const express = require("express");
const { Op } = require("sequelize");
const Comment = require("../models/comment");
const Bulletin = require("../models/bulletin");
const ImageArr = require("../models/image_arr");
const Hot = require("../models/hot");
const router = express.Router();
const Like = require("../models/like");

// 'http://localhost:3001/bulletin' = '/'

//모바일 게시글 조회
// 'http://localhost:3001/bulletin/inquery'
router.post("/inquery", async (req, res) => {
  try {
    const data = await Bulletin.findAll({
      order: [["bulletin_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    console.trace(err);
    return res.status(404);
  }
});
router.post("/image/inquire", async (req, res) => {
  try {
    const data = await ImageArr.findAll({
      where: {
        bulletin_id: req.body.bulletin_id,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.trace(err);
    return res.status(404);
  }
});
// 모바일 게시글 작성
// 'http://localhost:3001/bulletin/create'
router.post("/create", async (req, res, next) => {
  try {
    const data = await Bulletin.create({
      title: req.body.title,
      content: req.body.content,
      create_date: Date.now(),
      std_id: req.user.id,
    });
    if (req.body.images) {
      req.body.images.forEach(async (image) => {
        await ImageArr.create({
          path: image.localUri,
          bulletin_id: data.dataValues.bulletin_id,
        });
      });
    }
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});
//게시글 수정
//  'http://localhost:3001/bulletin/update'
router.post("/update", async (req, res) => {
  try {
    await Bulletin.update(
      {
        title: req.body.title,
        content: req.body.content,
        create_date: new Date(),
      },
      {
        where: {
          bulletin_id: req.body.id,
        },
      }
    );
    await ImageArr.destroy({
       where: {
        bulletin_id: req.body.id,
      },
    });
    if (req.body.images) {
      req.body.images.forEach(async (image) => {
        await ImageArr.create(
          {
            path: image.localUri,
            bulletin_id: req.body.id,
          },
          {
            where: {
              bulletin_id: req.body.id,
            },
          }
        );
      });
    }
    return res.status(200).send("success");
  } catch (err) {
    return new Error(err);
  }
});

// 모바일 게시글 검색
// 'http://localhost:3001/bulletin/search'
router.post("/search", async (req, res, next) => {
  try {
    const data = await Bulletin.findAll({
      where: {
        title: {
          [Op.like]: "%" + req.body.title + "%", // SQL의 LIKE문 사용해서 제목 검색
        },
      },
      order: [["bulletin_id", "DESC"]],
    });
    return res.status(200).json(data);
  } catch (err) {
    return new Error(err);
  }
});

//hot버튼 누르기
//'http://localhost:3001/bulletin/clickHot'
router.post("/clickHot", async (req, res) => {
  try {
    const data = await Like.findOne({
      where: { bulletin_id: req.body.id, std_id: req.user.id },
    });
    if (!data) {
      await Like.create({ bulletin_id: req.body.id, std_id: req.user.id });
      await Bulletin.increment(
        { hot: 1 },
        { where: { bulletin_id: req.body.id } }
      );
      const hotNum = await Bulletin.findOne({
        attributes: ["hot"],
        where: {
          bulletin_id: req.body.id,
        },
      });
      if (hotNum.dataValues.hot === 20) {
        await Hot.create({
          bulletin_id: req.body.id,
        });
      }

      return res.status(200).json(hotNum);
    } else {
      return res.status(200).send("한번 이상 클릭 하셨습니다.");
    }
  } catch (err) {
    return new Error(err);
  }
});

//모바일 게시글 조회수
// 'http://localhost:3001/bulletin/watch'
router.post("/watch", async (req, res) => {
  try {
    await Bulletin.increment(
      { views: 1 },
      { where: { bulletin_id: req.body.id } }
    );
    return res.status(200).send("watch success");
  } catch (err) {
    console.trace(err);
    return res.status(404);
  }
});

// 모바일 게시글 삭제
// 'http://localhost:3001/bulletin/delete'
// PK으로 삭제
router.delete("/delete", async (req, res, next) => {
  try {
    await Bulletin.destroy({
      where: {
        bulletin_id: req.body.bulletin_id,
      },
    });
    await Comment.destroy({
      where: {
        bulletin_id: req.body.bulletin_id,
      },
    });
    return res.status(200).send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
