import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface UserStopAttributes {
  id: number;
  userId: number;
  stopId: number;
  stopName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserStopCreationAttributes extends Optional<UserStopAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserStop extends Model<UserStopAttributes, UserStopCreationAttributes> implements UserStopAttributes {
  public id!: number;
  public userId!: number;
  public stopId!: number;
  public stopName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserStop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    stopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'stop_id',
      validate: {
        min: 1,
        max: 99999,
      },
    },
    stopName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'stop_name',
      validate: {
        len: [2, 100],
      },
    },
  },
  {
    sequelize,
    tableName: 'user_stops',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'stop_id'],
        name: 'unique_user_stop',
      },
    ],
  }
);

// Define associations
User.hasMany(UserStop, {
  foreignKey: 'userId',
  as: 'stops',
  onDelete: 'CASCADE',
});

UserStop.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default UserStop;
