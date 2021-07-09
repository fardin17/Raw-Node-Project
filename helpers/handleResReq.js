const url = require ('url')
const { StringDecoder } = require('string_decoder')
const routes = require('./../routes')
const { notFoundHandler } = require('./../handlers/notFoundHandler')
const {parseJSON} =require('./../helpers//utilities')

const handler = {}

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    // To prevent '/favicon.ico' from browser
    if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
    } 
    const path = parsedUrl.pathname
    // Using regular expression for trimming path
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); 
    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query
    const headerObject = req.headers
    const requestProperties = {
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject
    }
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler
    const decoder = new StringDecoder()
    let result = ''
    req.on('data', (Buffer) => {
        result += decoder.write(Buffer)
       
    })
    req.on('end', () => {
        result += decoder.end()
        requestProperties.body = parseJSON(result)
        chosenHandler(requestProperties, (statusCode, payload)=>{
        statusCode = typeof (statusCode) === 'number' ? statusCode : 500
        payload = typeof (payload) === 'object' ? payload : {}

            const payloadString = JSON.stringify(payload)
        res.setHeader('Content-Type','application/json')
        res.writeHead(statusCode)
        res.end(payloadString)
    })
    })
    
    
}
 module.exports = handler