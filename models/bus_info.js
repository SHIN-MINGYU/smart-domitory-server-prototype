const Sequelize = require("sequelize");
module.exports = class BusInfo extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bus_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        bus_date: {
          // 주말여부
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        bus_times: {
          // 회차
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        bus_time: {
          // 시간
          type: Sequelize.TIME,
          allowNull: false,
        },
        type: {
          // 운행방향
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        bus_stop: {
          // 정류장
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "BusInfo",
        tableName: "bus_info",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.BusInfo.belongsTo(db.AdmInfo, {
      foreignKey: "adm_id",
      sourceKey: "adm_id",
    });
  }
};
