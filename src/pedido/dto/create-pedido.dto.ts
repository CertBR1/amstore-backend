import { ApiProperty } from "@nestjs/swagger";

export class CreatePedidoDto {

    @ApiProperty(
        {
            example: [
                {
                    idServico: 1,
                    quantidadeSolicitada: 100
                },
                {
                    idServico: 2,
                    quantidadeSolicitada: 200
                }
            ],
            description: 'Servicos Solicitados',
        }
    )
    servicos: [
        {
            idServico: number,
            quantidadeSolicitada: number
        }
    ];

    @ApiProperty(
        {
            example: 'instagram.com/perfil',
            description: 'Link da rede social que ira receber o Servico',
        }
    )
    link: string;

    @ApiProperty(
        {
            example: 1,
            description: 'Quantidade Entregue',
        }
    )
    quantidadeEntregue?: number;

    @ApiProperty(
        {
            example: 1,
            description: 'Numero da Ordem',
        }
    )
    numeroOrdem?: number;

    @ApiProperty(
        {
            example: 1,
            description: 'Id da Transacao',
        }
    )
    idTransacao?: number;
}
