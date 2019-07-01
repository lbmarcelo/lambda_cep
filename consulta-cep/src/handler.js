const handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Consulta CEP Lambda"
      },
      null,
      2
    )
  };
};

module.exports.ceps = handler;
