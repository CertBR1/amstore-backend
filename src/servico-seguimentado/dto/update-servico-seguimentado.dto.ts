import { PartialType } from '@nestjs/mapped-types';
import { CreateServicoSeguimentadoDto } from './create-servico-seguimentado.dto';

export class UpdateServicoSeguimentadoDto extends PartialType(CreateServicoSeguimentadoDto) {}
