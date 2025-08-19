import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import WorkSpace from './workspace.model';
import FlashCard from './flashcard.model';
import Invite from './invite.model';
import WorkspaceUser from './workspace-user.model';

@Table({
  tableName: 'users',
  paranoid: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare avatar_url: string;

  
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password: string;

  @HasMany(() => WorkSpace)
  declare workspaces: WorkSpace[];

  @BelongsToMany(() => WorkSpace, () => WorkspaceUser)
  declare joined_workspaces: WorkSpace[];

  @HasMany(() => FlashCard)
  declare flashcards: FlashCard[];

  @HasMany(() => Invite)
  declare invites: Invite[];
}
