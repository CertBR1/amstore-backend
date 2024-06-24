import { ApiProperty } from "@nestjs/swagger";

export class CreateTipoSeguimentoDto {
    @ApiProperty(
        {
            description: 'Nome do tipo de seguimento',
            example: 'Tipo seguimento 1'
        }
    )
    nome: string;
}