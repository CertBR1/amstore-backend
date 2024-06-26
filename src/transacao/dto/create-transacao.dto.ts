import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive } from "class-validator";

export class CreateTransacaoDto {
    @ApiProperty(
        {
            example: 1,
            description: 'Identificador da transação',
        }
    )
    idTransacao: number;

    @ApiProperty(
        {
            example: 1,
            description: 'Identificador do pedido',
        }
    )
    @IsPositive({ message: 'O id do pedido deve ser positivo.' })
    @IsNotEmpty({ message: 'O id do pedido deve ser informado.' })
    idPedido: number;

    @ApiProperty(
        {
            example: 100,
            description: 'Valor da transação',
        }
    )
    @IsPositive({ message: 'O valor da transação deve ser positivo.' })
    @IsNotEmpty({ message: 'O valor da transação deve ser informado.' })
    valor: number;

    @ApiProperty(
        {
            example: new Date(),
            description: 'Data da solicitação da transação',
        }
    )
    dataSolicitacao: Date;

    @ApiProperty(
        {
            example: new Date(),
            description: 'Data do status da transação',
        }
    )
    dataStatus: Date;

    @ApiProperty(
        {
            example: new Date(),
            description: 'Data da aprovação da transação',
        }
    )
    dataAprovacao?: Date;

    @ApiProperty(
        {
            example: 1,
            description: 'Identificador da forma de pagamento',
        }
    )
    @IsPositive({ message: 'O id da forma de pagamento deve ser positivo.' })
    @IsNotEmpty({ message: 'O id da forma de pagamento deve ser informado.' })
    idFormaPagamento: number;
}
