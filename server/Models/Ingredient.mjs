import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { RecipeDetail } from "./RecipeDetail.mjs";

export const Ingredient = sequelize.define('Ingredient', {
    ingredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
        len: [2, 100],
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    packageSize: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
    },
    measurementUnit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'grams',
    },
    cost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        // TODO: HAGO PACKAGE SIZE (CREO QUE DIVIDIDO) POR EL COST Y ME DA EL VALOR DEL GRAMO, PARA DESPUES MULTIPLICARLO POR LA CANT. GRAMOS EN RECIPE DETAIL.
    },
    kcal: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    fat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    carbohydrates: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    fiber: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    proteins: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    sodium: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    glutenFree: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    vegetarian: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'User',
            key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
});

Ingredient.associateModels = () => {
    Ingredient.hasMany(RecipeDetail, { foreignKey: 'ingredientId', onDelete: 'CASCADE' });
};

// sequelize.sync();