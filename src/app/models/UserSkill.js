import { Model, DataTypes } from 'sequelize';

class UserSkill extends Model {
  static init(sequelize) {
    super.init(
      {
        skill_level: DataTypes.TINYINT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Instrument, {
      foreignKey: 'instrument_id',
      as: 'instrument',
    });
  }
}

export default UserSkill;
