const fs = require('fs')
const path = require('path')

const lib = {}

lib.basedir = path.join(`${__dirname}/../.data/`)

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback('Successfully inserted file!')
                        }
                        else {
                            callback('Error in closing new file')
                        }
                    })
                }
                else {
                    callback('Error writing data into file')
                }
            })
        }
        else {
            callback("Could not create a new File, File already exits!")
        }
    })
}

module.exports = lib