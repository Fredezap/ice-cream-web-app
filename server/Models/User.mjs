import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { AccountBlocked } from './AccountBlocked.mjs';
import { Device } from './Device.mjs';
import { Login } from './Login.mjs';
import { Recipe } from './Recipe.mjs'
import { Ingredient } from "./Ingredient.mjs";
import { RecipeDetail } from "./RecipeDetail.mjs";

export const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'guest'),
    allowNull: false,
    defaultValue: 'user',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasOne(AccountBlocked, { foreignKey: 'userId' });
User.hasMany(Device, { foreignKey: 'userId' });
User.hasMany(Login, { foreignKey: 'userId' });
User.hasMany(Recipe, { foreignKey: 'userId' });
User.hasMany(Ingredient, { foreignKey: 'userId' });

// Calling the assosiations betwen some models, after they have been initializated.
Ingredient.associateModels();
Recipe.associateModels();
RecipeDetail.associateModels();

// sequelize.sync()