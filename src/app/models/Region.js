import { Model, DataTypes } from 'sequelize';

class Region extends Model {
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
    this.hasMany(models.User, { as: 'users' });
  }
}

export default Region;
