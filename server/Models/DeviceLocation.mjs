import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';

export const DeviceLocation = sequelize.define('DeviceLocation', {
    deviceLocationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    anycast: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    hostname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    loc: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    org: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    postal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Device',
            key: 'deviceId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

// sequelize.sync();