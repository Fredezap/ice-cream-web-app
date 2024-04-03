'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    // Tabla RecipeDetail
    await queryInterface.createTable('RecipeDetail', {
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
        references: {
            model: 'Recipe',
            key: 'recipeId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        },
        ingredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Ingredient',
            key: 'ingredientId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        },
    });
    },
    down: async (queryInterface, Sequelize) => {
    // Eliminar tablas en orden inverso
    await queryInterface.dropTable('Recipe');
    await queryInterface.dropTable('RecipeDetail');
    await queryInterface.dropTable('Ingredient');
    }
    };