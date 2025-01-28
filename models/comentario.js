'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tarefa,{as:"tarefa"}),
      this.belongsTo(models.usuario,{as:"usuario"})
    }
  }
  comentario.init({
    texto: DataTypes.STRING,
    tarefaId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comentario',
  });
  return comentario;
};