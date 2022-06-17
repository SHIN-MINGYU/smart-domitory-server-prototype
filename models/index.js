const Sequelize = require("sequelize");
const AdmInfo = require("./adm_info");
const AsRequest = require("./as_request");
const BusInfo = require("./bus_info");
const BusRequest = require("./bus_request");
const Bulletin = require("./bulletin");
const Comment = require("./comment");
const MenuList = require("./menu_list");
const HlthRequest = require("./hlth_request");
const Holiday = require("./holiday");
const StayoutRequest = require("./stayout_request");
const StdInfo = require("./std_info");
const Hot = require("./hot");
const StdWait = require("./std_wait");
const ImageArr = require("./image_arr");
const Like = require("./like");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.AdmInfo = AdmInfo;
db.AsRequest = AsRequest;
db.BusInfo = BusInfo;
db.BusRequest = BusRequest;
db.Bulletin = Bulletin;
db.Comment = Comment;
db.MenuList = MenuList;
db.HlthRequest = HlthRequest;
db.Holiday = Holiday;
db.StayoutRequest = StayoutRequest;
db.StdInfo = StdInfo;
db.Hot = Hot;
db.StdWait = StdWait;
db.ImageArr = ImageArr;
db.Like = Like;

AdmInfo.init(sequelize);
AsRequest.init(sequelize);
BusInfo.init(sequelize);
BusRequest.init(sequelize);
Bulletin.init(sequelize);
Comment.init(sequelize);
MenuList.init(sequelize);
HlthRequest.init(sequelize);
Holiday.init(sequelize);
StayoutRequest.init(sequelize);
StdInfo.init(sequelize);
Hot.init(sequelize);
StdWait.init(sequelize);
ImageArr.init(sequelize);
Like.init(sequelize);

AdmInfo.associate(db);
AsRequest.associate(db);
BusInfo.associate(db);
BusRequest.associate(db);
Bulletin.associate(db);
Comment.associate(db);
MenuList.associate(db);
HlthRequest.associate(db);
Holiday.associate(db);
StayoutRequest.associate(db);
StdInfo.associate(db);
Hot.associate(db);
StdWait.associate(db);
ImageArr.associate(db);
Like.associate(db);

module.exports = db;
