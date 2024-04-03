import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { DeviceLocation } from './DeviceLocation.mjs'

export const Device = sequelize.define('Device', {
    deviceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    browser: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    },
    browserVersion: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    },
    date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    },
    deviceType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    },
    operatingSystem: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    },
    sessionOpened: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    },
    token: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
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

Device.hasOne(DeviceLocation, { foreignKey: 'deviceId' });

// sequelize.sync();