import Sequelize, { Model } from 'sequelize';
import { hash, compare } from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        nickname: Sequelize.STRING,
        email: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        first_skill_configuration: Sequelize.BOOLEAN,
        bio: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await hash(user.password, 10);
      }
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.UserSkill, { as: 'skills' });
    this.hasMany(models.UserStylePreference, { as: 'style_preferences' });
  }

  checkPassword(password) {
    return compare(password, this.password_hash);
  }
}

export default User;
