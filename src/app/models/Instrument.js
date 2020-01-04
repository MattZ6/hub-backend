import { Model, DataTypes } from 'sequelize';

class Instrument extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        label: DataTypes.STRING(12),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.UserSkill, { as: 'skills' });
  }
}

export default Instrument;
