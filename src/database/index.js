import Sequelize from 'sequelize';

import User from '../app/models/User';
import Instrument from '../app/models/Instrument';
import UserSkill from '../app/models/UserSkill';
import MusicStyle from '../app/models/MusicStyle';
import UserStylePreference from '../app/models/UserStylePreference';

import databaseConfig from '../config/database';

const models = [User, Instrument, UserSkill, MusicStyle, UserStylePreference];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
