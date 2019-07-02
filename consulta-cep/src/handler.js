const correios = require('./services/correios-service')

const handler = async event => {
  try {
    const { cep } = event.pathParameters

    const result = await correios.consulta(cep)

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }
}

module.exports.ceps = handler
