module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_skills', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      instrument_id: {
        type: Sequelize.INTEGER,
        references: { model: 'instruments', key: 'id' },
        allowNull: false,
      },
      skill_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('user_skills');
  },
};
