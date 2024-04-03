'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ingredients', {
      ingredientId: {
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
      packageSize: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      measurementUnit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'grams',
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      fat: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      proteins: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      carbohydrates: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      fiber: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      calories: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      vitamins: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      minerals: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      cholesterol: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      sodium: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      glutenFree: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      vegetarian: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      recipeDetailId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'RecipeDetails',
          key: 'recipeDetailId',
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
    await queryInterface.dropTable('Ingredients');
  }
};