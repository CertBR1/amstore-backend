export const templateEmail = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      /* Inclua o CSS do Bootstrap diretamente no cabeçalho do e-mail */
      @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css");

      /* Estilos adicionais para garantir que o e-mail fique bem em todos os clientes */
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
      }
      .email-header {
        text-align: center;
        text-transform: uppercase;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        padding: 10px;
        color: rgb(26, 92, 0);
      }
      .email-content {
        padding: 20px;
        text-align: center;
      }
      .email-footer {
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #6c757d;
      }
      .logo-email {
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
      }
      .logo-email img {
        width: 150px;
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="px-4 pt-4 pb-1">
        <div class="logo-email">
          <img src="{logo}" alt="Logo" />
        </div>
      </div>
      <div class="email-header">
        <h6>Validação de Email</h6>
      </div>
      <div class="email-content">
        <p>Olá, {user}</p>
        <p>Utilize o código abaixo para validar sua entrada:</p>
        <h2><strong  class="p-2 bg-success rounded-lg mb-2" style="max-width: fit-content;">{codigo}</strong></h2>
        <p>
          Se você não se registrou em nosso site, por favor ignore este e-mail.
        </p>
        <p>Obrigado,<br />Equipe {nomeLoja}</p>
      </div>
      <div class="email-footer">
        <p>Este é um e-mail automático, por favor não responda.</p>
      </div>
    </div>
  </body>
</html>
`;

export interface variaveisEmail {
    logo: string
    user: string
    codigo: string
    nomeLoja: string
}