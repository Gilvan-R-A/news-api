module.exports = class ValidadorUsuario {

    static validaEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validaSenha(senha) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(senha);
    }

    static async usuarioJaExiste(conexao, email, isSQLite) {
        if (isSQLite) {
            const row = conexao.prepare(
                `SELECT * FROM usuario WHERE emailUsuario = ?`
            ).get(email);
            return !!row;
        } else {
            const resultado = await conexao.query(
                `SELECT * FROM usuario WHERE emailUsuario = $1`, 
                [email]
            );
            return resultado.rowCount > 0;
        }
    }
};

