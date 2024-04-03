import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { Recipe } from './Recipe.mjs';
import { Ingredient} from './Ingredient.mjs';

export const RecipeDetail = sequelize.define('RecipeDetail', {
    recipeDetailId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ingredientQuantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'Recipe',
            key: 'recipeId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'Ingredient',
            key: 'ingredientId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

RecipeDetail.associateModels = () => {
    RecipeDetail.belongsTo(Recipe, { foreignKey: 'recipeId' });
    RecipeDetail.belongsTo(Ingredient, { foreignKey: 'ingredientId' });
};


// sequelize.sync();