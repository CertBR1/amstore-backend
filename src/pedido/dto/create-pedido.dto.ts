import { ApiProperty } from "@nestjs/swagger";

export class CreatePedidoDto {
    @ApiProperty(
        {
            example: 1,
            description: 'Id do Servico',
        }
    )
    idServico: number;

    @ApiProperty(
        {
            example: 1,
            description: 'Id do Fornecedor',
        }
    )
    idPedido: number;

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
            description: 'Quantidade do Servico',
        }
    )
    quantidadeSolicitada: number;

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
