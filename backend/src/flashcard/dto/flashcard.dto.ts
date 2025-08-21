import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { DATA_TYPE } from 'src/utils/data-type.enum';

export class FlashCardGenerateDTO {
  @IsNumber()
  workspace_id: number;

  @IsString()
  @IsNotEmpty()
  temporary_flashcard_id: string;
}

export class RawDataUploadDTO {
  @IsString()
  text: string; //it will be user input text or extracted text from the pdf file

  @IsEnum(DATA_TYPE)
  @IsNotEmpty()
  data_type: DATA_TYPE;
}
