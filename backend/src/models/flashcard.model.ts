import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './user.model';
import WorkSpace from './workspace.model';
import FlashCardRawData from './flashcard-raw-data.model';

@Table({
  tableName: 'flashcards',
})
export default class FlashCard extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare file_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare temporary_flashcard_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare user_id: number;

  @ForeignKey(() => WorkSpace)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare workspace_id: number;

  @BelongsTo(() => User)
  declare created_by: User;

  @BelongsTo(() => WorkSpace)
  declare workspace: WorkSpace;

  @HasOne(() => FlashCardRawData)
  declare raw_data: FlashCardRawData;
}
