'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Recipes', {
      recipeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [2, 500],
        },
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
    await queryInterface.dropTable('Recipes');
  }
};