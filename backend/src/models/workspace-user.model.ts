import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import User from './user.model';
import WorkSpace from './workspace.model';
import { WORKSPACE_USER_ROLE } from 'src/utils/workspace-user-role.enum';
import WorkspaceUserPermission from './workspace-user-permission.model';

@Table({
  tableName: 'workspace-users',
})
export default class WorkspaceUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  
  @Default(WORKSPACE_USER_ROLE.MEMBER)
  @Column({
    type: DataType.ENUM,
    values: Object.values(WORKSPACE_USER_ROLE),
    allowNull: false,
  })
  declare role: WORKSPACE_USER_ROLE;

  @Unique('workspace-user')
  @ForeignKey(() => User)
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number; //team member id

  @Unique('workspace-user')
  @ForeignKey(() => WorkSpace)
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare workspace_id: number;

  @HasOne(() => WorkspaceUserPermission)
  declare workspace_user_permissions: WorkspaceUserPermission;
}
