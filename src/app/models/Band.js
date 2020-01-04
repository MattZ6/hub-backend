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
    this.hasMany(models.BandStyle, { as: 'styles' });
  }
}

export default Band;
