export class CreateServicoPedidoDto {

    idServico: number;

    idPedido: number;

    link: string;

    quantidadeSolicitada: number;

    quantidadeEntregue?: number;

    numeroOrdem?: number;

    idTransacao?: number;
}
