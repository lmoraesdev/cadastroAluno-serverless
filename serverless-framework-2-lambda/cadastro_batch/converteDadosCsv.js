const { parse } = require('fast-csv');

async function converteDadosCsv(dados) {
  const resultado = await new Promise((resolver, rejeitar) => {
    const alunos = [];

    const regexEmail = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const stream = parse({ headers: ['nome', 'email'], renameHeaders: true })
      .validate((aluno) => regexEmail.test(aluno.email))
      .on('data', (aluno) => alunos.push(aluno))
      .on('data-invalid', (aluno) =>
        rejeitar(
          new Error(
            `O email informado para o aluno ${aluno.nome} é inválido (${aluno.email})`
          )
        )
      )
      .on('error', (erro) =>
        rejeitar(new Error('Houve um erro no processamento do arquivo CSV.'))
      )
      .on('end', () => resolver(alunos));
    stream.write(dados);
    stream.end();
  });

  if (resultado instanceof Error) {
    throw resultado;
  }

  return resultado;
}

module.exports = { converteDadosCsv };
