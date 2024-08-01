import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CreateClienteDto } from "src/cliente/dto/create-cliente.dto";
import { MeioPagamento } from "src/utils/enums/MeioPagamento.enum";

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
            quantidadeSolicitada: number,
            link: string;
        }
    ];

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

    @IsEnum(MeioPagamento, { message: 'Metodo de Pagamento Invalido, Escolha entre: ' + Object.values(MeioPagamento).join(', ') })
    @ApiProperty(
        {
            example: MeioPagamento.PIX,
            description: 'Metodo de Pagamento',
        }
    )
    meioPagamento?: MeioPagamento;

    numeroOrdem?: number;

    idTransacao?: number;

    @ApiProperty(
        {
            example: ['Comentarios personalizados', 'Comentarios personalizados2'],
            description: 'Comentarios personalizados',
        }
    )
    comentarios?: string[];
}
