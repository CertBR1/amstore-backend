import { ApiProperty } from "@nestjs/swagger";

export class CreateSeguimentoDto {

    @ApiProperty(
        {
            example: 'Seguimento 1',
            description: 'Nome do seguimento',
        }
    )
    nome: string;

    @ApiProperty(
        {
            example: 1,
            description: 'Id do tipo de seguimento',
        }
    )
    idTipoSEguimento: number;
}
