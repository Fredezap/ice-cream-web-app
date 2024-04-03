import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { LoginLocation } from './LoginLocation.mjs'

export const Login = sequelize.define('Login', {
    loginId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    browser: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    browserVersion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    deviceType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    operatingSystem: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    result: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    },
});

Login.hasOne(LoginLocation, { foreignKey: 'loginId' });

// sequelize.sync();