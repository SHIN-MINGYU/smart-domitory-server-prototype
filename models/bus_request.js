const Sequelize = require("sequelize");
module.exports = class BusRequest extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bus_req_id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true
        },
        bus_date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        bus_way: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        bus_stop: {
          type: Sequelize.STRING(45),
          allowNull: false
        },
        bus_time: {
          type: Sequelize.TIME,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "BusRequest",
        tableName: "bus_request",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
      }
    );
  }
  static associate(db) {
    db.BusRequest.belongsTo(db.StdInfo, {
      foreignKey: "std_id",
      sourceKey: "std_id"
    });
  }
};
