import { Model } from 'sequelize';

class BandMember extends Model {
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
    this.belongsTo(models.Band, { foreignKey: 'band_id', as: 'band' });
    this.belongsTo(models.MusicStyle, {
      foreignKey: 'user_skill_id',
      as: 'member',
    });
  }
}

export default BandMember;
