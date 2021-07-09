const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
        callback(404, {
                message:'Your request not found!'
        })
        console.log(requestProperties)
        console.log('Your request not found!')
}

module. exports = handler