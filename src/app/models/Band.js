import { Model, DataTypes } from 'sequelize';

class Band extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'leader_id', as: 'leader' });
  }
}

export default Band;
