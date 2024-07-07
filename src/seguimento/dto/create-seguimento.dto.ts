import { ApiProperty } from "@nestjs/swagger";
import { TipoSeguimento } from "../entities/tipo-seguimento.entity";

export class CreateSeguimentoDto {

    @ApiProperty(
        {
            example: 'Seguimento 1',
            description: 'Nome do seguimento',
        }
    )
    nome: string;

}
