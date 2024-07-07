## Implementação de enpoints administrativos 

- [x] Implentar autenticacao para admin

- [x] Criar seguimentados
- [x] Deletar seguimentos
- [x] Criar servicos
- [x] Editar servicos
    - [x] Criar associaçoes com serviço seguimentados
    - [x] Editar serviços seguimentados
- [x] Atualizar status de pedido -> pode ser feito no endpoint de UPDATE
- [x] Mudar status de um cliente -> pode ser feito no endpoint de UPDATE
- [x] Cadastrar fornecedores 
- [x] Editar fornecedores
- [x] Cadastrar categoria
- [x] Editar categoria
- [x] Deletar (desativar) categoria
- [x] Cadastrar subcategoria
- [x] Editar subcategoria
- [x] Deletar (desativar ) subcategoria
- [x] Cadastrar metodos e configuracao de pagamento 
- [x] Deletar (desativar) metodos de pagamentos
- [x] Aterar senha do administrador logado -> pode ser feito enviando a senha no endpoint de UPDATE

## Implementação de login por whatsapp

- [ ] Implementar autenticação JWT para usuario executar o pedido 
    - [x] Deve gerar um numero de 6 digitos aleatorio
    - [x] Armazenar isso em cache por N tempo -> tempo padrao 60 segundos
    - [ ] Enviar o codigo para o numero do cliente
        - [ ] Criar interface de comunicação com o serviço externo que vai enviar a mensagem
        - [ ]
    - [ ] Receber em um endpoint o numero de whatsapp do cliente 
        - [ ] Validar se o codigo recebido e o mesmo armazenado em cache
        - [ ] Devolver um JWT que deve ser enviado para conclusao do pedido
- [ ] Implementar um login por email usando a mesma logica        

## Implementação do gateway de pagamentos do Mercado Pago

- [ ] Criar pagamentos
- [ ] Buscar pagamentos  
- [ ] Buscar status de pagamento

## Implementação da interface de comunicação com os paineis

- [ ] Consultar saldo
- [ ] Executar pedido
- [ ] Solicitar status do pedido
- [ ] 

## Implementação do webhook

- [ ] Receber o a solicitação do mercado pago
- [ ] Verificar o status do pagamento
- [ ] Executar o pedido no painel
- [ ] 


## BUG

- [X] Nome do fornecedor nao esta cadastrando

- [ ] Documentação do swagger