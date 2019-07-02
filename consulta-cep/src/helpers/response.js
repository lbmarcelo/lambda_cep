const response = (payload, statusCode = 200, error = false) => {
  let body = payload

  if (error) {
    body = { error: payload }
  }

  return {
    statusCode,
    body: JSON.stringify(body)
  }
}

module.exports = response
