# Jira Server MCP (Model Context Protocol)

Um MCP (Model Context Protocol) para integração com Jira Server auto-hospedado, desenvolvido especificamente para uso com o Cursor IDE.

## Características

- Suporte completo para Jira Server (testado na versão 9.5.1)
- Autenticação via Bearer Token
- Comandos para gerenciamento de issues, busca e transições
- Configuração simplificada via variáveis de ambiente
- Compatível com o protocolo MCP do Cursor

## Instalação e Configuração

### Método 1: Usando npx (Recomendado)

1. Configure o MCP no arquivo `.cursor/mcp.json` do seu projeto:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["jira-server-mcp"],
      "env": {
        "JIRA_BASE_URL": "http://seu-jira-server:8080",
        "JIRA_API_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### Método 2: Clonando o Repositório

1. Clone este repositório dentro da pasta `.cursor/mcp-jira` do seu projeto:

```bash
mkdir -p .cursor/mcp-jira
git clone https://github.com/valter-tonon/jira-server-mcp.git .cursor/mcp-jira
```

2. Instale as dependências:

```bash
cd .cursor/mcp-jira
npm install
```

3. Configure o MCP no arquivo `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [".cursor/mcp-jira/src/index.js"],
      "env": {
        "JIRA_BASE_URL": "http://seu-jira-server:8080",
        "JIRA_API_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

## Comandos Disponíveis

- `test`: Testa a conexão com o Jira Server
- `get-issue <issue-key>`: Obtém detalhes de uma issue específica
- `search <jql>`: Busca issues usando JQL (Jira Query Language)
- `get-transitions <issue-key>`: Lista as transições disponíveis para uma issue
- `get-changelog <issue-key>`: Obtém o histórico de mudanças de uma issue

## Exemplos de Uso

### Usando npx

```bash
# Testar conexão
npx jira-server-mcp test

# Buscar Issue
npx jira-server-mcp get-issue CLI-24238

# Buscar com JQL
npx jira-server-mcp search "project = CLI AND status = 'In Progress'"
```

### Usando o Repositório Local

```bash
# Testar conexão
node src/index.js test

# Buscar Issue
node src/index.js get-issue CLI-24238

# Buscar com JQL
node src/index.js search "project = CLI AND status = 'In Progress'"
```

## Configuração

O MCP suporta dois formatos de configuração:

### 1. Variáveis de Ambiente Individuais

```json
{
  "env": {
    "JIRA_BASE_URL": "http://seu-jira-server:8080",
    "JIRA_API_TOKEN": "seu-token-aqui"
  }
}
```

### 2. Configuração JSON Completa (via MCP_CONFIG)

```json
{
  "env": {
    "MCP_CONFIG": "{\"jira\":{\"baseUrl\":\"http://seu-jira-server:8080\",\"authentication\":{\"basic\":{\"apiToken\":\"seu-token-aqui\"}}}}"
  }
}
```

## Desenvolvimento

### Estrutura do Projeto

```
.cursor/mcp-jira/
├── src/
│   └── index.js    # Código principal do MCP
├── package.json    # Dependências e scripts
└── README.md      # Esta documentação
```

### Requisitos

- Node.js >= 14
- npm >= 6
- Jira Server >= 9.0

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para reportar bugs ou solicitar features, por favor abra uma issue no GitHub. 