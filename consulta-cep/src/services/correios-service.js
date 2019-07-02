const request = require('request-promise-native')
const { xml2json } = require('xml-js')

const sanitizeObj = xmlObj => {
  const xml = JSON.parse(xml2json(xmlObj, { compact: true }))

  const objCep =
    xml['soap:Envelope']['soap:Body']['ns2:consultaCEPResponse']['return']

  const mapped = Object.keys(objCep).map(prop => ({
    [prop]: objCep[prop]._text
  }))

  return Object.assign({}, ...mapped)
}

const envelope = cep => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">
        <soapenv:Header/>
        <soapenv:Body>
        <cli:consultaCEP>
            <cep>${cep}</cep>
        </cli:consultaCEP>
        </soapenv:Body>
    </soapenv:Envelope>
    `
}

const consulta = async cep => {
  var options = {
    method: 'POST',
    url:
      'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente',
    headers: {
      'Content-Type': 'application/xml'
    },
    body: envelope(cep)
  }

  try {
    const xml = await request(options, function (error, response, body) {
      if (error) throw new Error(error)
      return body
    })

    return sanitizeObj(xml)
  } catch (error) {
    const xml = JSON.parse(xml2json(error.error, { compact: true }))

    const msg =
      xml['soap:Envelope']['soap:Body']['soap:Fault']['faultstring']._text

    throw Error(msg)
  }
}

module.exports = { consulta }
