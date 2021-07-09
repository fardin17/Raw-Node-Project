const url = require ('url')
const { StringDecoder } = require('string_decoder')

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
    const decoder = new StringDecoder()
    let result = ''
    req.on('data', (Buffer) => {
        result += decoder.write(Buffer)
       
    })
    req.on('end', () => {
        decoder.end()
        console.log(result)
    })
    console.log(parsedUrl)
    console.log(path)
    console.log(trimmedPath)
    console.log(method)
    console.log(queryStringObject)
    console.log(headerObject)
    res.end("Hello Bro!")
}
 module.exports = handler