import { IsEnum } from "class-validator";
import { MeioPagamento } from "src/utils/enums/MeioPagamento.enum";

class ConfiguracaoDto {
    nome: string;
    key: string;
    status: boolean;
}
export class CreateFormaPagamentoDto {
    descricao: string;
    configuracao?: ConfiguracaoDto;
    @IsEnum(MeioPagamento, {
        message: `Meio de pagamento inválido. Valores aceitos: ${Object.values(MeioPagamento)}`,
    })
    metodoPagamento: MeioPagamento;
}