import { PartialType } from '@nestjs/mapped-types';
import { CreateSeguimentoDto } from './create-seguimento.dto';

export class UpdateSeguimentoDto extends PartialType(CreateSeguimentoDto) {}
