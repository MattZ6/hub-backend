import { Model } from 'sequelize';

class BandStyle extends Model {
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
      foreignKey: 'music_style_id',
      as: 'style',
    });
  }
}

export default BandStyle;
