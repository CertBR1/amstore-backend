import { PartialType } from '@nestjs/swagger';
import { CreateWhastappClientDto } from './create-whastapp-client.dto';

export class UpdateWhastappClientDto extends PartialType(CreateWhastappClientDto) {}
