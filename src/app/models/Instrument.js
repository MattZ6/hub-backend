import Sequelize, { Model } from 'sequelize';

class Instrument extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        label: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.InstrumentUserSkill, {
      as: 'skills',
      foreignKey: 'instrument_id',
    });
  }
}

export default Instrument;
