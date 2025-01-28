'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tarefa,{as:"tarefa"})
    }
  }
  log.init({
    statusantigo: DataTypes.STRING,
    novostatus: DataTypes.STRING,
    tarefaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'log',
  });
  return log;
};