'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecipeDetails', {
      recipeDetailId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ingredientQuantity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'Recipes',
          key: 'recipeId',
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
    await queryInterface.dropTable('RecipeDetails');
  }
};