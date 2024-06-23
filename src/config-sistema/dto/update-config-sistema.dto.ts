import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigSistemaDto } from './create-config-sistema.dto';

export class UpdateConfigSistemaDto extends PartialType(CreateConfigSistemaDto) {}
