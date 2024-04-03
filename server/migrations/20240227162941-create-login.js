'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Logins', {
      loginId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      browserVersion: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deviceType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      operatingSystem: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      result: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'Users',
          key: 'userId',
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
    await queryInterface.dropTable('Logins');
  }
};