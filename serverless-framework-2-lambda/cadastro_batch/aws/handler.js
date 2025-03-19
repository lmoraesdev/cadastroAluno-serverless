const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { cadastrarAlunosNoBd } = require('../cadastrarAlunosNoBd');
const { converteDadosCsv } = require('../converteDadosCsv');

async function obtemDadosDoCsvDoBucket(nome, chave) {
  const cliente = new S3Client({});

  const comando = new GetObjectCommand({
    Bucket: nome,
    Key: chave,
  });

  const resposta = await cliente.send(comando);
  const dadosCsv = await resposta.Body.transformToString();

  return dadosCsv;
}

module.exports.cadastrarAluno = async (evento) => {
  try {
    const eventoS3 = evento.Records[0].s3;

    const nomeBucket = eventoS3.bucket.name;
    const chaveBucket = decodeURIComponent(
      eventoS3.object.key.replace(/\+/g, ' ')
    );
    const dadosArquivo = await obtemDadosDoCsvDoBucket(nomeBucket, chaveBucket);

    const alunos = converteDadosCsv(daddosArquivo);

    await cadastrarAlunosNoBd(alunos);
  } catch (erro) {
    return {
      statusCode: erro.statusCode || 500,
      body: JSON.stringify(erro),
    };
  }
};
