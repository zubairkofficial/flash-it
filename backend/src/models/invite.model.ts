import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import User from './user.model';
import WorkSpace from './workspace.model';
import { v4 as uuidv4 } from 'uuid';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';
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

  @Unique('invite-link-unique')
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare admin_id: number; //workspace admin who created the link

  @Unique('invite-link-unique')
  @ForeignKey(() => WorkSpace)
  @Column({
    type: DataType.INTEGER,
  })
  declare workspace_id: number;

  @Unique('invite-link-unique')
  @Column({
    type: DataType.ENUM,
    values: Object.values(WORKSPACE_USER_PERMISSION),
    allowNull: false,
  })
  declare permission: WORKSPACE_USER_PERMISSION;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare generated_by: User;

  @BelongsTo(() => WorkSpace, { onDelete: 'CASCADE' })
  declare workspace: WorkSpace;
}
