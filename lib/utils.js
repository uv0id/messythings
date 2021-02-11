const axios = require('axios'),
    fse = require('fs-extra'),
    fs = require('fs'),
    imgDownloader = require('image-downloader'),

exports.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.downloadImg = async (params) => {
    const {url, dest} = params
    
    try {
        await imgDownloader.image({
            url: url,
            dest: dest
        })
        return true
    } catch(e) {
        throw e
        return false
    }
}

exports.safeDirName = name => name.toString().replace(/[^a-z0-9 ]/gi, '_');