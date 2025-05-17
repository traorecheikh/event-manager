'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'N/A',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'location');
  }
};

