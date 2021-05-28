const browserObject = require('./browser');
const scraperController = require('./pageController');
const pagePdfScraper = require('./pagePdfScraper');
const pdfAObjt = require('../pdfparse/index')


let browserInstance = browserObject.startBrowser();

const scraperPdfs = () => new Promise(async (resolve, reject) => {
    scraperController(browserInstance)
        .then((d) => {
            pagePdfScraper(browserInstance, d.group)
                .then((r) => {
                    console.log(r)
                    resolve(r)
                    // pdfAObjt(r)
                    //     .then((data) => { console.log(data); console.log('yeaaaaaaaaasiiiiiiiiiiiiiiiiii') })
                })
                .catch((e) => console.error(e))
        })
        .catch((e) => { console.error(e) })

}
)

module.exports = scraperPdfs;



