import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './user.model';
import WorkSpace from './workspace.model';
import {v4 as uuidv4} from 'uuid';
@Table({
  tableName: 'invites',
})
export default class Invite extends Model {
  
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    defaultValue: uuidv4, // Automatically generates a UUID for each new invite
  })
  declare id: string;
  
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare expire_toggle: boolean; //if expire_toggle = true, there will be 24 hours logic in business logic

  @ForeignKey(() => User)
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare admin_id: number; //workspace admin who created the link

  @ForeignKey(() => WorkSpace)
  
  @Column({
    type: DataType.INTEGER,
  })
  declare workspace_id: number;

  @BelongsTo(() => User)
  declare generated_by: User;

  @BelongsTo(() => WorkSpace)
  declare workspace: WorkSpace;
}
