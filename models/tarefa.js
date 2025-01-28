'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tarefa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.comentario,{as:"comentario"}),
      this.hasMany(models.log,{as:"log"}),
      this.belongsTo(models.usuario,{as:"usuario"})
    }
  }
  tarefa.init({
    titulo: DataTypes.STRING,
    descricao: DataTypes.STRING,
    status: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tarefa',
  });
  return tarefa;
};