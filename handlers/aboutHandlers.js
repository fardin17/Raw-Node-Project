const handler = {}

handler.aboutHandler = (requestProperties, callback) => {
        console.log(requestProperties)
        console.log('Hello, i am fardin. I am MEARN stack developer!')
        callback(200, {
                message:'Hello, i am fardin. I am MEARN stack developer!'
        })
}

module. exports = handler