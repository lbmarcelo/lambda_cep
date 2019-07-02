const reponse = require('./helpers/response')
const correios = require('./services/correios-service')

const handler = async event => {
  try {
    const { cep } = event.pathParameters

    const result = await correios.consulta(cep)

    return reponse(result, 200)
  } catch (error) {
    return reponse(error.message, 400, true)
  }
}

module.exports.ceps = handler
