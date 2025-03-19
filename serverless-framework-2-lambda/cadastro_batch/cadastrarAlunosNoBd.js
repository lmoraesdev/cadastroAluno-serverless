async function cadastrarAlunosNoBd(alunos) {
  const alunosPromessas = alunos.map(async (aluno) => {
    return fetch(
      'http://curso-serverless2-api-731872985.us-east-1.elb.amazonaws.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
      }
    );
  });

  const respostas = await Promise.all(alunosPromessas);
  if (respostas.some((resposta) => !resposta.ok)) {
    throw new Error('Houve um erro ao cadastrar os alunos no banco de dados.');
  }
}

module.exports = { cadastrarAlunosNoBd };
