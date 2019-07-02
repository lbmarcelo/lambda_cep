const request = require('request-promise-native')
const { xml2json } = require('xml-js')

const sanitizeObj = xmlObj => {
  const xml = JSON.parse(xml2json(xmlObj))

  const obj = {}

  xml.elements[0].elements[0].elements[0].elements[0].elements.map(item => {
    const prop = item.name
    let value = ''

    if (item.elements && item.elements.length > 0) {
      value = item.elements[0].text || ''
    }

    obj[prop] = value
  })

  return obj
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
    const xml = JSON.parse(xml2json(error.error))
    const msg =
      xml.elements[0].elements[0].elements[0].elements[1].elements[0].text
    throw Error(msg)
  }
}

module.exports = { consulta }
