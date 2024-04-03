import { Sequelize } from 'sequelize';
import { dbConfig } from './dbConfig.mjs';

export const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
  // logging: console.log,
});