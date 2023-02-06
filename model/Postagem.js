module.exports = class Postagem{
    constructor(idPostagem, tituloPostagem, conteudoPostagem, categoriaPostagem, dataPostagem){
        this.idPostagem = idPostagem;
        this.tituloPostagem = tituloPostagem;
        this.conteudoPostagem = conteudoPostagem;
        this.categoriaPostagem = categoriaPostagem;
        this.dataPostagem = dataPostagem;
    }
}