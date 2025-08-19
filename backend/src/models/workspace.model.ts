import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './user.model';
import { SubscriptionPlan } from './subscription-plan.model';
import FlashCard from './flashcard.model';
import Invite from './invite.model';
import WorkspaceUser from './workspace-user.model';

@Table({
  tableName: 'workspaces',
})
export default class WorkSpace extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number; //team_id or workspace_id

  
  @Column({
    type: DataType.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  })
  declare credit: number; //only workspace admin can do addition into it

  @ForeignKey(() => User)
  
  @Column({
    type: DataType.INTEGER,
  })
  declare admin_user_id: number;

  @ForeignKey(() => SubscriptionPlan)
  
  @Column({
    type: DataType.INTEGER,
  })
  declare plan_id: number;

  @BelongsTo(() => User)
  declare admin: User;

  @BelongsTo(() => SubscriptionPlan)
  declare subscription_plan: SubscriptionPlan;

  @BelongsToMany(() => User, () => WorkspaceUser)
  declare members: User[];

  @HasMany(() => FlashCard)
  declare flashcards: FlashCard[];

  @HasMany(() => Invite)
  declare invites: Invite[];
}
