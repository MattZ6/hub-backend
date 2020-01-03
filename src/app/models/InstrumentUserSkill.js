import { Model } from 'sequelize';

class InstrumentUserSkill extends Model {
  static init(sequelize) {
    super.init(
      {},
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

export default InstrumentUserSkill;
