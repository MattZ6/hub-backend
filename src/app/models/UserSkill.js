import { Model, DataTypes } from 'sequelize';

class UserSkill extends Model {
  static init(sequelize) {
    super.init(
      {
        skill_level: DataTypes.TINYINT,
        skill_level_label: {
          type: DataTypes.VIRTUAL,
          get() {
            if (this.skill_level === 1) {
              return 'Iniciante';
            }

            if (this.skill_level === 2) {
              return 'Intermediário';
            }

            return 'Avançado';
          },
        },
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

    this.hasMany(models.BandMember, { as: 'bands' });
  }
}

export default UserSkill;
