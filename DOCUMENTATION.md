# Documentação Técnica - Sistema Cargoblue

Este documento descreve como o sistema funciona, para facilitar manutenções e desenvolvimentos futuros.

## Estrutura de Arquivos

```
cargoblue/
├── index.html              # Página principal
├── frota.html              # Página da frota
├── rastreamento.html       # Página de rastreamento
├── css/
│   ├── style.css           # Estilos principais
│   └── font-awesome.css    # Ícones Font Awesome
├── js/
│   └── script.js           # Lógica JavaScript
├── arquivos de referencia/
│   └── img/
│       └── bg/             # Imagens da frota
└── backup/                 # Arquivos de backup
```

## Funcionalidades Principais

### 1. Navegação e Layout
- **Header**: Menu responsivo com links para todas as páginas.
- **Footer**: Informações da empresa, links sociais, formulário de newsletter.
- **Responsividade**: Usa CSS Grid e Flexbox para adaptar a dispositivos móveis.

### 2. Calculadora de Frete
**Arquivo**: `js/script.js` (função `calculateAndDisplayRoute`)

**Como Funciona**:
1. Usuário preenche origem, destino, paradas, veículo, carga.
2. Clica em "Calcular".
3. Sistema geocodifica endereços via Nominatim API.
4. Calcula rota e distância via OSRM API.
5. Aplica fórmulas da ANTT para custo.
6. Exibe resultado com detalhes e botões de contato.

**APIs Usadas**:
- Nominatim (OpenStreetMap): Geocodificação.
- OSRM: Cálculo de rotas por estrada.

**Fórmulas ANTT**:
- Custo base = Distância × Tarifa do veículo × Quantidade de veículos.
- Ajustes: Retorno (vazio ou carregado), peso (R$ 0.015/kg), volume (R$ 5/m³), paradas (+20% por parada).

**Design do Resultado**:
- Layout moderno com cards e gradientes.
- Informações organizadas: preço principal, distância, detalhes da rota.
- Botões de ação: WhatsApp e e-mail para contato direto.
- Design responsivo com ícones Font Awesome.
- Função `resetCalculator()` para limpar formulário após cálculo.

### 3. Rastreamento de Cargas
**Arquivo**: `js/script.js` (formulário `tracking-form`)

**Como Funciona**:
- Atualmente simulado com códigos hardcoded (`CB123456789BR`, etc.).
- Para produção: Substituir por consulta a banco de dados via API.

**Fluxo**:
1. Usuário insere código.
2. Sistema "busca" (atual: switch case).
3. Exibe status, origem, destino, datas.

### 4. Formulários de Contato e Newsletter
**Arquivo**: `js/script.js`

**Como Funciona**:
- Integrado com EmailJS para envio real de e-mails.
- Templates configuráveis no EmailJS.
- Validação básica no frontend.

**Fluxo**:
1. Usuário preenche formulário.
2. Submit chama `emailjs.send()`.
3. E-mail enviado para conta configurada.
4. Alerta de sucesso/erro.

### 5. Funcionalidades Interativas
- **Autocomplete**: Para endereços (Nominatim) e CEPs (ViaCEP).
- **Modal de Imagens**: Na página da frota, clica nas fotos para ampliar.
- **Copiar Texto**: Ícones para copiar WhatsApp e e-mail.
- **Links de Navegação**: Google Maps e Waze para o endereço.
- **Resultado da Calculadora**: Design moderno com cards, gradientes e botões de ação (WhatsApp/e-mail).
- **Reset da Calculadora**: Função para limpar formulário após cálculo.

## Tecnologias Usadas

- **HTML5**: Estrutura semântica.
- **CSS3**: Estilos modernos, variáveis CSS, transições.
- **JavaScript ES6+**: Lógica, APIs, manipulação DOM.
- **Font Awesome**: Ícones.
- **EmailJS**: Envio de e-mails sem backend.
- **OpenStreetMap APIs**: Geocodificação e rotas.

## APIs e Serviços Externos

| Serviço | Uso | URL |
|---------|-----|-----|
| Nominatim | Geocodificação | https://nominatim.openstreetmap.org |
| OSRM | Cálculo de rotas | https://routing.openstreetmap.de |
| ViaCEP | Consulta de CEPs | https://viacep.com.br |
| EmailJS | Envio de e-mails | https://cdn.jsdelivr.net/npm/@emailjs/browser |
| OpenStreetMap | Mapa embed | https://www.openstreetmap.org |

## Variáveis e Constantes Importantes

**CSS (`style.css`)**:
- `--primary`: Cor principal (#1a73e8).
- `--shadow`: Sombra padrão.
- `--transition`: Transições suaves.
- **Resultado da Calculadora**: Classes `.result-main-card`, `.result-header`, `.price-display`, `.detail-card`, etc. para layout moderno com cards e gradientes.

**JavaScript (`script.js`)**:
- `vehicleCostPerKm`: Tarifas por veículo (objeto).
- Códigos de rastreamento simulados.
- IDs de formulários e elementos DOM.

## Manutenção Comum

### Atualizar Informações da Empresa:
- Editar texto no footer de todas as páginas.
- Atualizar coordenadas do mapa se endereço mudar.

### Adicionar Novos Veículos:
- Adicionar imagem em `img/bg/`.
- Editar HTML em `frota.html`.
- Atualizar CSS se necessário.

### Modificar Cálculos:
- Ajustar fórmulas em `calculateCost()`.
- Testar com diferentes cenários.

### Modificar Design do Resultado da Calculadora:
- Editar estilos CSS das classes `.result-*` em `style.css`.
- Personalizar cores, layout e animações dos cards.
- Ajustar responsividade para diferentes dispositivos.

### Adicionar Páginas:
- Criar novo `.html` seguindo estrutura existente.
- Adicionar link no menu.
- Incluir footer igual.

### Debugging:
- Console do navegador para erros JavaScript.
- Network tab para requisições API.
- Testar responsividade com DevTools.

## Limitações Atuais

- Rastreamento simulado (não conectado a banco).
- Dependente de APIs externas (podem ter limites).
- E-mails via EmailJS (limite gratuito).
- Sem backend para dados dinâmicos.

## Melhorias Futuras

- Implementar backend para rastreamento real.
- Adicionar autenticação para área administrativa.
- Integrar sistema de pagamentos.
- Otimizar performance (lazy loading de imagens).
- Adicionar testes automatizados.

## Contato para Suporte

Para dúvidas técnicas, consulte este documento ou entre em contato com o desenvolvedor responsável.</content>
<parameter name="filePath">DOCUMENTATION.md