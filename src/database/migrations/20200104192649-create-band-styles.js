module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('band_styles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      band_id: {
        type: Sequelize.INTEGER,
        references: { model: 'bands', key: 'id' },
        allowNull: false,
      },
      music_style_id: {
        type: Sequelize.INTEGER,
        references: { model: 'music_styles', key: 'id' },
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
    return queryInterface.dropTable('band_styles');
  },
};
