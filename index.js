/*
 * Title: Uptime monitoring Application 
 * Description: A RESTul API to monitor up or down time of user defined links
 * Author: Fardin Islam
 * Date: 07/09/21
 *
 */
const http = require('http')
const {handleReqRes} = require ('./helpers/handleResReq')
const app = {}

app.config = {
    port: 3000
}
app.createServer = () => {
    const server = http.createServer(handleReqRes)
    server.listen(app.config.port, () => {
        console.log("Server listening at port at ",app.config.port)
    })
}
app.createServer()