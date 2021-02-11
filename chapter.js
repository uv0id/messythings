const axios = require('axios'),
    fse = require('fs-extra'),
    path = require('path'),
    readline = require('readline'),
    imgDownloader = require('image-downloader'),
    {downloadImg, sleep, safeDirName} = require('./lib/utils');

const API__BASE_URL = "https://mangadex.org/api/v2";
const API_CHAPTER_URL = API__BASE_URL + "/chapter/";

const getChapter = async (chapter, url = API_CHAPTER_URL) => {
    try {
        let response = await axios.get(url + chapter, {
            params: {
                saver: true
            }
        });

        if (response.status === 200)
            return response.data.data
        else
            return false;
    } catch (err) {
        console.error("There was an error getting the chapter: "+err)
        return false
    }
}

(async function() {
    let lastChapter = ""
    let filename = __dirname + "/ch-lists/"+process.argv[2]
    rl = readline.createInterface(fse.createReadStream(filename))

    rl.on('line', async line => {
        axios.get(API_CHAPTER_URL + line, {params: {saver: true}})
            .then(resp => {
                if (resp.status === 200)
                return resp.data.data
            })
            .then(currChapter => {
                if (currChapter.chapter === lastChapter) { // already downloaded
                    console.log("\033[31m Chapter already downloaded ! Skipping...")
                } else {
                    let destDir = path.resolve(__dirname, 
                        `public/${safeDirName(currChapter.mangaTitle)}/
                         volume_${safeDirName(currChapter.volume || 'misc')}/chapter_${safeDirName(currChapter.chapter || 1)}`)
                    // let logpath = destDir + "/logfile-" + currChapter.chapter
                    console.log(`destination directory: ${destDir}`)

                    try {
                        fse.ensureDir(destDir)
                        // fse.createFile(logpath)
                    } catch (e) {
                        throw e
                    }

                    let pages = currChapter.pages
                    // fse.appendFile(logpath, line.toString())

                    for (let i = 0; i < pages.length; i++) {
                        imgDownloader.image({url: `${currChapter.server}${currChapter.hash}
                        /${currChapter.pages[i]}`, dest: destDir})
                            .then(() => {
                                console.log('img downloaded')
                                // setTimeout(() => {}, 1000)
                            })
                        // fse.appendFile(logpath, pages[i] + "\n")
                    }

                    lastChapter = currChapter.chapter
                }
            })
    })
})()