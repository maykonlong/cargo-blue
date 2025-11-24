# Guia de Configuração - Cargoblue Website

Este documento explica todas as configurações necessárias para que o website da Cargoblue funcione completamente.

## 1. Configuração do EmailJS (Envio de E-mails)

### Passos para Configurar:
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/) e crie uma conta gratuita.
2. Vá para "Email Services" e adicione um serviço de e-mail (recomendado: Gmail).
3. Vá para "Email Templates" e crie dois templates:
   - **Template de Contato**: Para mensagens do formulário de contato.
   - **Template de Newsletter**: Para inscrições na newsletter.

### IDs Necessários:
Após configurar, obtenha:
- **Public Key**: Chave pública da sua conta.
- **Service ID**: ID do serviço de e-mail configurado.
- **Template IDs**: IDs dos templates criados.

### Substituir no Código:
Em todos os arquivos HTML (`index.html`, `frota.html`, `rastreamento.html`) e `js/script.js`, substitua:
- `YOUR_PUBLIC_KEY` pela sua chave pública.
- `YOUR_SERVICE_ID` pelo ID do serviço.
- `YOUR_TEMPLATE_ID` pelo ID do template de contato.
- `YOUR_NEWSLETTER_TEMPLATE_ID` pelo ID do template de newsletter.

### Exemplo de Template de Contato:
```
Assunto: Nova mensagem de contato - {{from_name}}

Nome: {{from_name}}
E-mail: {{from_email}}
Telefone: {{phone}}
Mensagem: {{message}}
```

### Exemplo de Template de Newsletter:
```
Assunto: Nova inscrição na newsletter

E-mail: {{newsletter_email}}
```

## 2. Configuração do Rastreamento (Opcional - Para Produção)

Atualmente, o rastreamento usa códigos simulados. Para produção:

### Banco de Dados:
- Configure um banco de dados (ex: MySQL, PostgreSQL) para armazenar:
  - tracking_code (string, único)
  - status (string: "Postado", "Em trânsito", "Entregue", etc.)
  - origin (string)
  - destination (string)
  - last_update (datetime)
  - additional_info (text)

### Backend API:
- Crie uma API (ex: Node.js + Express) com endpoint `/api/track/:code`
- A API consulta o banco e retorna os dados em JSON.

### Atualizar JavaScript:
No `js/script.js`, substitua o switch case por uma fetch para a API:
```javascript
fetch(`/api/track/${trackingCode}`)
  .then(response => response.json())
  .then(data => {
    if (data.found) {
      // Exibir dados do banco
    } else {
      // Código não encontrado
    }
  });
```

## 3. Hospedagem

### Requisitos:
- Servidor web (ex: Apache, Nginx) ou plataforma (Vercel, Netlify, GitHub Pages).
- Para funcionalidades completas, um servidor com backend (se implementar API de rastreamento).

### Upload dos Arquivos:
- Faça upload de todos os arquivos para o servidor.
- Certifique-se de que `css/`, `js/`, `img/` e subpastas sejam incluídas.

## 4. Testes

### Funcionalidades a Testar:
- Formulários de contato e newsletter (envio de e-mail).
- Calculadora de frete (incluindo novo design do resultado com cards e botões de ação).
- Rastreamento (códigos simulados).
- Links de navegação (Maps, Waze).
- Responsividade em dispositivos móveis (especialmente o novo layout da calculadora).
- Modal de imagens na página da frota.

### Navegadores Compatíveis:
- Chrome, Firefox, Safari, Edge (versões recentes).

## 5. Manutenção

- Atualize imagens em `arquivos de referencia/img/bg/` conforme necessário.
- Monitore o uso do EmailJS (limite gratuito: 200 e-mails/mês).
- Para produção, implemente analytics (Google Analytics) e backup do banco.

## 6. Segurança

- Não exponha chaves API no código público.
- Use HTTPS em produção.
- Valide inputs dos formulários no backend.

## Suporte

Para dúvidas, consulte a documentação do EmailJS ou entre em contato com o desenvolvedor.</content>
<parameter name="filePath">SETUP.md