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

@Table({
  tableName: 'invites',
})
export default class Invite extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  declare id: string; //it will act as route param to find the invite table - 10 to 20 character string

  
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
