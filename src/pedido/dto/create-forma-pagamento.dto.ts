class ConfiguracaoDto {
    nome: string;
    key: string;
    metodoPagamento: string;
}
export class CreateFormaPagamentoDto {
    descricao: string;
    status: string;
    configuracao: ConfiguracaoDto;
}