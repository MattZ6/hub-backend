import { Model, DataTypes } from 'sequelize';

import getAvatarUrl from '../services/getAvatarUrl';

class Avatar extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        ext: DataTypes.STRING,
        mimeType: DataTypes.STRING,
        size: DataTypes.NUMBER,
        path: DataTypes.STRING,
        url: {
          type: DataTypes.VIRTUAL,
          get() {
            return getAvatarUrl(this.name);
          },
        },
      },
      {
        sequelize,
      }
    );

    // this.addHook('beforeSave', avatar => {
    //   console.log(avatar);
    // });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Avatar;
