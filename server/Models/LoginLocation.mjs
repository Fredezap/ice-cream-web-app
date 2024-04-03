import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';

export const LoginLocation = sequelize.define('LoginLocation', {
    loginLocationId: {
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
    loginId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'Login',
            key: 'loginId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

// sequelize.sync();