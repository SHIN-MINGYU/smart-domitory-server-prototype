const express = require("express");
const StdInfo = require("../models/std_info");
const router = express.Router();

//'http://localhost:3001/admin/agree' = '/'

// 사용자 관리

// 권한이 없는 학생 (access === false) 조회
//'http://localhost:3001/admin/agree'
router.post("/", async (req, res, next) => {
  try {
    const data = await StdInfo.findAll({
      where: {
        access: false,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 관리자가 학생에게 사이트 로그인 권한을 부여해줌
//'http://localhost:3001/admin/agree'
router.patch("/", async (req, res, next) => {
  try {
    let checkedStd = req.body.std_id; // 체크된 학생의 학번
    const data = await StdInfo.update(
      {
        access: true,
      },
      { where: { std_id: checkedStd } }
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 관리자가 학생에게 사이트 로그인 권한 삭제 (DB에서 학생 정보 삭제)
//'http://localhost:3001/admin/agree'
router.delete("/", async (req, res, next) => {
  try {
    let checkedStd = req.body.std_id; // 체크된 학생의 학번
    const data = await StdInfo.destory({ where: { std_id: checkedStd } });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
