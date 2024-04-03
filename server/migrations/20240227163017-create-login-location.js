'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LoginLocations', {
      loginLocationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      anycast: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      hostname: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      loc: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      org: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      postal: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      loginId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'Logins',
          key: 'loginId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LoginLocations');
  }
};