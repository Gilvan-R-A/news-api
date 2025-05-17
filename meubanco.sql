/*Código para criar uma tabela*/
create table postagem(
idPostagem serial primary key,
tituloPostagem varchar(200)	not null,
conteudoPostagem varchar(500) not null,
categoriaPostagem varchar(100) not null,
dataPostagem varchar(20) not null
);

/*código para consultar todos os dados de uma tabela*/
select * from postagem

/*código para inserir dados na tabela postagem*/
insert into postagem (titulopostagem, conteudopostagem, categoriapostagem, datapostagem) 
values ('Alta do Real', 'O Real supervaloriza 3 semanas seguidas em comparação com o dólar', 'Economia', '21/11/2025');

