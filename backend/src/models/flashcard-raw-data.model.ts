import {
  AllowNull,
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
import { DATA_TYPE } from 'src/utils/data-type.enum';
import FlashCard from './flashcard.model';

@Table({
  tableName: 'flashcard-raw-data',
  
})
export default class FlashCardRawData extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare text: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare file_url: string;

  
  @Column({
    type: DataType.ENUM,
    values: Object.values(DATA_TYPE),
    allowNull: false,
  })
  declare data_type: DATA_TYPE;

  @ForeignKey(() => FlashCard)
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare flashcard_id: number;

  @BelongsTo(() => FlashCard)
  declare flashcard: FlashCard;
}
