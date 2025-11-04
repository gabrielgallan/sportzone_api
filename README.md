## RF (Requisitos funcionais)

- [x] O usuário deve poder se registrar;
- [x] O usuário deve poder se autenticar;
- [x] O usuário deve poder acessar seu perfil;
- [x] O usuário deve poder reservar uma quadra por um tempo determinado;
- [ ] O usuário deve poder listar todas suas últimas reservas;
- [ ] O usuário deve poder listar quadras próximas a ele;
- [ ] O usuário deve poder pesquisar quadras por endereço;
- [ ] O usuário deve poder pesquisar quadras pelo tipo de esporte na descrição;
- [ ] Deve ser possível validar a reserva de um usuário;
- [ ] Deve ser possível cadastrar uma quadra;

## RN (Regras de negócio)

- [x] Não pode haver dois usuários com o mesmo email;
- [x] A reserva só pode ser realizada se o horário da quadra estiver dispónivel;
- [x] O usuário não pode fazer mais do que 1 reserva por dia;
- [x] A reserva deve ser feita com no mínimo 2 horas de antecedencia;
- [x] O usuário não pode reservar uma quadra por mais de 6 horas;
- [ ] Para a reserva ser validada deve haver o pagamento em até 15 minutos (via pix ou cartão);
- [ ] As quadras só podem ser cadastradas por administradores;

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário deve estar criptografada;
- [x] Os dados da aplicação devem ser persistidos em um banco PostgreSQL;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] O pagamento da reserva deve ser realizado via uma API de pagamento;

## To Fix

- payments repositories