import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { FLASHCARD_SLIDE_TYPE } from 'src/utils/flashcard-slide-type.enum';
import FlashCard from './flashcard.model';

@Table({
  tableName: 'flashcard-slides',
})
export default class FlashCardSlide extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(),
    values: Object.values(FLASHCARD_SLIDE_TYPE),
    allowNull: false,
  })
  declare slide_type: FLASHCARD_SLIDE_TYPE;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare text: string;

  @ForeignKey(() => FlashCard)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  declare flashcard_id: number;

  @BelongsTo(() => FlashCard, { onDelete: 'CASCADE' })
  declare flashcard: FlashCard;
}
