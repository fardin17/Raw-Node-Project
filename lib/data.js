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
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data)
    })
}
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, 'utf8', (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback('Successfully Updated!')
                                }
                                else {
                                    callback('Error in closing file')
                                }
                            })
                        }
                    })
                }
                else {
                    callback("File can't truncate")
                }
            })
            
        }
        else {
            callback("File not found")
        }
    })
    
}
module.exports = lib