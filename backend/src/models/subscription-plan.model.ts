import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { SUBSCRIPTION_TYPE } from 'src/utils/subscription.enum';
import WorkSpace from './workspace.model';

@Table({
  tableName: 'subscription-plans',
  
})
export class SubscriptionPlan extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Unique
  @Column({
    type: DataType.STRING,
    values: Object.values(SUBSCRIPTION_TYPE),
    allowNull: false,
    unique: true
  })
  declare plan_type: SUBSCRIPTION_TYPE;

  
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  declare features: string[];

  @HasMany(() => WorkSpace)
  declare workspaces: WorkSpace[];
}
