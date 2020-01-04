import { Model } from 'sequelize';

class UserStylePreference extends Model {
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
    this.belongsTo(models.MusicStyle, {
      foreignKey: 'music_style_id',
      as: 'style',
    });
  }
}

export default UserStylePreference;
