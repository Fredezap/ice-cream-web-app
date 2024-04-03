import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';

export const AccountBlocked = sequelize.define('AccountBlocked', {
    accountBlockedId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    loginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    },
    lockedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'User',
            key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

// sequelize.sync();
