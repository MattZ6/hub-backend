import { Model, DataTypes } from 'sequelize';

class MusicStyle extends Model {
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
    this.hasMany(models.UserStylePreference, { as: 'users' });
    this.hasMany(models.BandStyle, { as: 'bands' });
  }
}

export default MusicStyle;
