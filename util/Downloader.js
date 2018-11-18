const fs = require("fs");
const http = require("http");

class Downloader {
    constructor(cdnUrl, localUri) {
        this.cdnUrl = cdnUrl;
        this.localUri = localUri;
    }

    getAndCacheFile(path) {
        return new Promise((resolve, reject) => {
            let file = fs.createWriteStream(this.localUri + path);
            http.get(this.cdnUrl + path, (response) => {
                response.pipe(file).on("error", (err) => {
                    return reject(err);
                }).on("finish", () => {
                    fs.readFile(this.localUri + path, (err, data) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(data);
                        }
                    });
                });
            });
        });
    } 

    getBuffer(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.localUri + path, (err, data) => {
                if (err) {
                    if (err.code == "ENOENT") {
                        return resolve(this.getAndCacheFile(path));
                    } else {
                        return reject(err);
                    }
                } else {
                    return resolve(data);
                }
            })
        });
    }
}

module.exports = Downloader;
