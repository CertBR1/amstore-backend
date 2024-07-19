import { ApiProperty } from "@nestjs/swagger";
import { CreateClienteDto } from "src/cliente/dto/create-cliente.dto";

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
            idSeguimento?: number,
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
            description: 'Forma de Pagamento',
        }
    )
    idFormaPagamento: number

    @ApiProperty(
        {
            example: 'Vendedor2000',
            description: 'Usuario do vendedor em caso de venda por link',
        }
    )
    origem?: string;

    cliente: CreateClienteDto;

    quantidadeEntregue?: number;

    numeroOrdem?: number;

    idTransacao?: number;

}
