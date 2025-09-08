import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
export class FlashCardFirstGenerateDTO {


  @IsString()
  @IsNotEmpty()
  tempId: string;
}

export class RawDataUploadDTO {
  @IsString()
  text: string; //it will be user input text or extracted text from the pdf file
 
  @IsString()
  title: string;

  @IsString()
  language: string;
  
  @IsOptional()
  @IsEnum(DATA_TYPE)
  @IsNotEmpty()
  data_type: DATA_TYPE;
}
