# Jira Server MCP

MCP (Model Context Protocol) para integração com Jira Server auto-hospedado.

## Instalação

```bash
npm install -g jira-server-mcp
```

## Configuração

O uso recomendado atualmente é via arquivo `.cursor/mcp.json`, integrando com ferramentas como Cursor IDE ou automações MCP.

### Exemplo de configuração (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["jira-server-mcp@1.1.0"],
      "env": {
        "JIRA_BASE_URL": "http://seu-jira-server:8080",
        "JIRA_API_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

- O campo `command` deve ser `npx`.
- O campo `args` recebe o pacote e versão.
- As variáveis de ambiente são passadas no bloco `env`.

## Uso

A partir da configuração acima, o MCP será chamado automaticamente pelas ferramentas compatíveis (ex: Cursor IDE) para executar consultas e comandos no Jira.

### Exemplos de comandos suportados
- Buscar uma issue por chave
- Buscar issues usando JQL
- Consultar worklogs
- Listar transições disponíveis

> **Obs:** O uso via CLI direto ou como servidor SSE está depreciado para novos projetos. Prefira sempre a configuração via MCP/`mcp.json`.

## Desenvolvimento

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute os testes: `npm test`
4. Para desenvolvimento local:
   - Inicie o servidor: `npm start`
   - Use a CLI: `npm run cli -- <comando> [argumentos]`

## Licença

MIT 