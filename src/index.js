#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Função para carregar a configuração
function loadConfig() {
  try {
    console.log('Variáveis de ambiente:', {
      JIRA_BASE_URL: process.env.JIRA_BASE_URL,
      JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
      MCP_CONFIG: process.env.MCP_CONFIG
    });

    // Se MCP_CONFIG foi fornecido, use-o
    if (process.env.MCP_CONFIG) {
      return JSON.parse(process.env.MCP_CONFIG).jira;
    }

    // Se as variáveis individuais foram fornecidas
    if (process.env.JIRA_BASE_URL && process.env.JIRA_API_TOKEN) {
      return {
        baseUrl: process.env.JIRA_BASE_URL,
        authentication: {
          basic: {
            apiToken: process.env.JIRA_API_TOKEN
          }
        }
      };
    }

    throw new Error('Configuração não encontrada');
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    throw error;
  }
}

class JiraAPI {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.token = config.authentication.basic.apiToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Jira API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos da API do Jira
  async getIssue(issueKey) {
    return this.request(`/rest/api/2/issue/${issueKey}`);
  }

  async searchIssues(jql) {
    return this.request('/rest/api/2/search', {
      method: 'POST',
      body: JSON.stringify({
        jql,
        maxResults: 50
      })
    });
  }

  async getIssueTransitions(issueKey) {
    return this.request(`/rest/api/2/issue/${issueKey}/transitions`);
  }

  async getIssueChangelog(issueKey) {
    return this.request(`/rest/api/2/issue/${issueKey}/changelog`);
  }

  async getMyself() {
    return this.request('/rest/api/2/myself');
  }
}

// Função para processar os comandos do MCP
async function handleCommand(command, args, config) {
  const jira = new JiraAPI(config);

  try {
    switch (command) {
      case 'get-issue':
        if (!args[0]) {
          throw new Error('Issue key is required');
        }
        const issue = await jira.getIssue(args[0]);
        return {
          type: 'success',
          data: issue
        };

      case 'search':
        if (!args[0]) {
          throw new Error('JQL query is required');
        }
        const results = await jira.searchIssues(args[0]);
        return {
          type: 'success',
          data: results
        };

      case 'get-transitions':
        if (!args[0]) {
          throw new Error('Issue key is required');
        }
        const transitions = await jira.getIssueTransitions(args[0]);
        return {
          type: 'success',
          data: transitions
        };

      case 'get-changelog':
        if (!args[0]) {
          throw new Error('Issue key is required');
        }
        const changelog = await jira.getIssueChangelog(args[0]);
        return {
          type: 'success',
          data: changelog
        };

      case 'test':
        const user = await jira.getMyself();
        return {
          type: 'success',
          data: {
            message: 'Conexão estabelecida com sucesso!',
            user
          }
        };

      default:
        return {
          type: 'error',
          data: {
            message: `Comando não reconhecido: ${command}`
          }
        };
    }
  } catch (error) {
    return {
      type: 'error',
      data: {
        message: error.message
      }
    };
  }
}

// Função principal que será chamada pelo Cursor
async function main() {
  const [command, ...args] = process.argv.slice(2);
  
  try {
    const config = loadConfig();
    
    const result = await handleCommand(command, args, config);
    
    if (result.type === 'error') {
      console.error(result.data.message);
      process.exit(1);
    } else {
      console.log(JSON.stringify(result.data, null, 2));
    }
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

main(); 