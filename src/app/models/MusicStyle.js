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
}

export default MusicStyle;
