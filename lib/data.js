const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(`${__dirname}/../.data/`);

lib.create = (dir, file, data, callback) => {
	fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data);
			fs.writeFile(fileDescriptor, stringData, err => {
				if (!err) {
					fs.close(fileDescriptor, err => {
						if (!err) {
							callback(false);
						} else {
							callback('Error in closing new file');
						}
					});
				} else {
					callback('Error writing data into file');
				}
			});
		} else {
			callback('Could not create a new File, File already exits!');
		}
	});
};
lib.read = (dir, file, callback) => {
	fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
		callback(err, data);
	});
};
lib.update = (dir, file, data, callback) => {
	fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data);
			fs.ftruncate(fileDescriptor, err => {
				if (!err) {
					fs.writeFile(fileDescriptor, stringData, 'utf8', err => {
						if (!err) {
							fs.close(fileDescriptor, err => {
								if (!err) {
									callback(false);
								} else {
									callback('Error in closing file');
								}
							});
						}
					});
				} else {
					callback("File can't truncate");
				}
			});
		} else {
			callback('File not found');
		}
	});
};
lib.delete = (dir, file, callback) => {
	fs.unlink(`${lib.basedir + dir}/${file}.json`, err => {
		if (!err) {
			callback(false);
		} else {
			callback('File can not delete!');
		}
	});
};
lib.list = (dir, callback) => {
	fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
		if (!err && fileNames && fileNames.length > 0) {
			let trimedFiles = [];
			fileNames.forEach(fileName =>
				trimedFiles.push(fileName.replace('.json', '')),
			);
			callback(false, trimedFiles);
		} else {
			callback('File not exist!');
		}
	});
};
module.exports = lib;
