# AXION OFFICE

Protótipo local do AXION OFFICE para CRM, depósito de documentos e ferramentas internas.

## Correr localmente

**Pré-requisitos:** Node.js 22.

1. Instalar dependências:

   ```bash
   npm install
   ```

2. Criar `.env` ou `.env.local` a partir de [.env.example](.env.example).

3. Arrancar o servidor local:

   ```bash
   npm run dev
   ```

4. Abrir:

   ```text
   http://localhost:3000
   ```

## Google Sheets e Drive

O backend usa credenciais apenas do servidor. Nunca criar variáveis com prefixo `VITE_` para chaves privadas, tokens ou secrets, porque variáveis `VITE_` são expostas ao browser.

### CRM via Google Sheets

Configurar no `.env`:

```env
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Em alternativa, para desenvolvimento local:

```env
GOOGLE_SERVICE_ACCOUNT_FILE=/absolute/path/to/service-account.json
```

### Depósito de documentos

A listagem lê a pasta Google Drive `DOCS` configurada em:

```env
GOOGLE_DRIVE_DOCS_FOLDER_ID=1_Xtah1WKj_YoxZoOjNABiM0TjuWBvef8
```

Uploads para uma conta Google normal precisam de OAuth local, porque Service Accounts não têm quota própria para guardar ficheiros em My Drive.

## OAuth Google local para uploads

Este fluxo é apenas para `localhost`. Antes de produção, substituir por autenticação AXION real, callbacks HTTPS, tokens encriptados, auditoria, revogação e permissões por utilizador/organização.

1. Abrir a Google Cloud Console no projeto que tem acesso ao Drive.

2. Ativar a Google Drive API.

3. Configurar o OAuth consent screen:

   - Tipo: `External`, se for uma conta Google normal.
   - Publishing status: `Testing` enquanto for local.
   - Test users: adicionar o email Google que vai fazer upload.

4. Criar credenciais OAuth:

   - Tipo: `OAuth client ID`.
   - Application type: `Web application`.
   - Authorized JavaScript origins:

     ```text
     http://localhost:3000
     ```

   - Authorized redirect URIs:

     ```text
     http://localhost:3000/api/google/oauth/callback
     ```

5. Adicionar ao `.env` local:

   ```env
   GOOGLE_OAUTH_CLIENT_ID=...
   GOOGLE_OAUTH_CLIENT_SECRET=...
   GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback
   ```

6. Reiniciar o servidor:

   ```bash
   npm run dev
   ```

7. No AXION OFFICE, abrir o depósito de documentos e carregar em `Ligar Google Drive`.

8. Depois do consentimento Google, o upload envia ficheiros até 50 MB diretamente para a pasta `DOCS`.

O grant OAuth fica guardado apenas localmente em `.axion-local/google-oauth.json`, ignorado pelo Git e criado com permissões restritas. Não enviar esse ficheiro nem os valores do `.env` por chat.

## Comandos úteis

```bash
npm test
npm run lint
npm run build
```
