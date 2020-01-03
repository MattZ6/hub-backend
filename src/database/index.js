import Sequelize from 'sequelize';

import User from '../app/models/User';
import Instrument from '../app/models/Instrument';
import InstrumentUserSkill from '../app/models/InstrumentUserSkill';

import databaseConfig from '../config/database';

const models = [User, Instrument, InstrumentUserSkill];

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
