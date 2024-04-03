'use strict';
module.exports = {
up: async (queryInterface, Sequelize) => {
await queryInterface.createTable('Recipes', {
    recipeId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
    },
    name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        len: [2, 100]
    }
    },
    description: {
    type: Sequelize.STRING,
    allowNull: true,
    },
    userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    references: {
        model: 'Users',
        key: 'userId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    },
    createdAt: {
    allowNull: false,
    type: Sequelize.DATE
    },
    updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
    }
});

await queryInterface.createTable('Ingredients', {
    ingredientId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
    },
    name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        len: [2, 100]
    }
    },
    description: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
        len: [2, 500]
    }
    },
    packageSize: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    measurementUnit: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'grams'
    },
    cost: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    fat: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    proteins: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    carbohydrates: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    fiber: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    calories: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    vitamins: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    minerals: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    cholesterol: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    sodium: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    defaultValue: 0
    },
    glutenFree: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
    },
    vegetarian: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
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
    allowNull: false,
    type: Sequelize.DATE
    },
    updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
    }
});

await queryInterface.createTable('RecipeDetails', {
    recipeDetailId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
    },
    ingredientQuantity: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    defaultValue: 0
    },
    recipeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    references: {
        model: 'Recipes',
        key: 'recipeId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    },
    ingredientId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    references: {
        model: 'Ingredients',
        key: 'ingredientId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    },
    createdAt: {
    allowNull: false,
    type: Sequelize.DATE
    },
    updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
    }
});

await queryInterface.addConstraint('RecipeDetails', {
    fields: ['recipeId', 'ingredientId'],
    type: 'unique',
    name: 'unique_recipe_ingredient'
});
},
down: async (queryInterface, Sequelize) => {
await queryInterface.dropTable('Recipes');
await queryInterface.dropTable('RecipeDetails');
await queryInterface.dropTable('Ingredients');
}
};