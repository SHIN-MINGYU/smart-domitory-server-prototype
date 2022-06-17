const Sequelize = require('sequelize');
module.exports = class Holiday extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        holiday_id: {
          primaryKey: true,
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Holiday',
        tableName: 'holiday',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Holiday.belongsTo(db.AdmInfo, {
      foreignKey: 'adm_id',
      sourceKey: 'adm_id',
    });
  }
};
