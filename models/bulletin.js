const Sequelize = require("sequelize");
module.exports = class Bulletin extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bulletin_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        views: {
          // 조회수
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        hot: {
          // 추천수
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        create_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Bulletin",
        tableName: "bulletin",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Bulletin.belongsTo(db.StdInfo, {
      foreignKey: "std_id",
      sourceKey: "std_id",
    });
    db.Bulletin.hasMany(db.Hot, {
      foreignKey: "bulletin_id",
      sourceKey: "bulletin_id",
    });
    db.Bulletin.hasMany(db.Comment, {
      foreignKey: "bulletin_id",
      sourceKey: "bulletin_id",
    });
    db.Bulletin.hasMany(db.ImageArr, {
      foreignKey: "bulletin_id",
      sourceKey: "bulletin_id",
    });
    db.Bulletin.hasMany(db.Like, {
      foreignKey: "bulletin_id",
      sourceKey: "bulletin_id",
    });
  }
};
