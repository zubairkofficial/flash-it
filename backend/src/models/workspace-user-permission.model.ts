import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import WorkspaceUser from './workspace-user.model';
import { WORKSPACE_USER_PERMISSION } from 'src/utils/permission.enum';

@Table({
  tableName: 'workspace-user-permissions',
})
export default class WorkspaceUserPermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  
  @Column({
    type: DataType.ENUM,
    values: Object.values(WORKSPACE_USER_PERMISSION),
    allowNull: false,
  })
  declare permissions: WORKSPACE_USER_PERMISSION;

  @ForeignKey(() => WorkspaceUser)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  declare workspace_user_id: number;

  @BelongsTo(() => WorkspaceUser, { onDelete: 'CASCADE' })
  declare workspace_user: WorkspaceUser;
}

//there are two types of rights Edit (Create, Read, Update, Delete, Export) and Read (Read, Export),
