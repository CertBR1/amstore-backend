class ConfiguracaoDto {
    nome: string
    key: string
}
export class CreateFormaPagamentoDto {
    descricao: string
    status: string
    configuracao: ConfiguracaoDto
}