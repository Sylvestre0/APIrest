# API de Usuários

### Comandos `curl`

a tela de login/register tambem ta funcionando só não coloquei nenhum redirect só abrir com o F12 e ver 

## register
```bash
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{
      "name": "testeXX",
      "email": "testeXX@example.com",
      "password": "Password@123",
      "googleId": null
    }'
```
## login
```bash
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{
      "email": "testeXX@example.com",
      "password": "Password@123"
    }'
```
## getUsers
```bash
curl -X GET http://localhost:3000/allUsers
```
## updateUsers
```bash
curl -X PUT http://localhost:3000/alterUsers/ID \
-H "Content-Type: application/json" \
-d '{
      "name": "NovoNome",
      "email": "novoemail@example.com",
      "password": "Newpassword@123"
    }'
```
## deleteUsers
```bash
curl -X DELETE http://localhost:3000/deleteUsers/ID \
-H "Content-Type: application/json" \
-d '{
      "password": "senhausada"
    }'
```