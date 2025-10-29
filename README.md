## RF (Requisitos funcionais)

- [x] O usuário deve poder se registrar;
- [x] O usuário deve poder se autenticar;
- [ ] O usuário deve poder acessar seu perfil;
- [ ] O usuário deve poder listar todas suas últimas locações;
- [ ] O usuário deve poder listar quadras próximas a ele;
- [ ] O usuário deve poder pesquisar quadras por endereço;
- [ ] O usuário deve poder pesquisar quadras pelo tipo de esporte na descrição;
- [ ] O usuário deve poder alugar uma quadra por um tempo determinado;
- [ ] Deve ser possível validar o aluguel de um usuário
- [ ] Deve ser possível cadastrar uma quadra

## RN (Regras de negócio)

- [x] Não pode haver dois usuários com o mesmo email
- [ ] O usuário não pode fazer mais do que 1 aluguel por dia
- [ ] O usuário não pode alugar uma quadra por mais de 6 horas
- [ ] As quadras só podem ser cadastradas por administradores

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário deve estar criptografada
- [x] Os dados da aplicação devem ser persistidos em um banco PostgreSQL
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)