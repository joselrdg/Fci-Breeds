require("../config/db.config");
const mongoose = require("mongoose");

const Scraper = require("../models/Scraper.model");
const BreedsFci = require("../models/BreedsFci.model");

const browserObject = require("../scraper/browser");
const scraperPdfs = require("../scraper/index");
const pdfAObjt = require("../pdfparse/index");

const extractimg = require("../pdfparse/extractimg");

const lang = [
  { lang: "es", num: 332 },
  { lang: "en", num: 342 },
  { lang: "de", num: 341 },
  { lang: "fr", num: 342 },
];

mongoose.connection
  .once("open", () => {
    console.info(
      `*** Connected to the database ${mongoose.connection.db.databaseName} ***`
    );

    pdfAObjt(10, "fr")
    // pdfAObjt(lang[0].num, lang[0].lang)
    // pdfAObjt(lang[1].num, lang[1].lang)
      // pdfAObjt(lang[2].num, lang[2].lang)
      // pdfAObjt(lang[3].num, lang[3].lang)
      .then((data) => {
        console.log(data);
        // BreedsFci.create(data[0])
        // .then((e)=>{console.log(e);console.log('Razas guardadas en bd')})
        // .catch((e) => console.error(e))
      })
      .catch((e) => {
        console.error(e);
        next(err);
      });

    // scraperPdfs()
    // .then((e)=>{
    //   console.log(e)
    //   console.log(e.numName + ' Pdfs descargados');
    // pdfAObjt(e)
    // .then((data) => {
    //   console.log(data)
    //   BreedsFci.create(data)
    //   .then((e)=>{console.log(e);console.log('Razas guardadas en bd')})
    //   .catch((e) => console.error(e))
    // })
    // })
  })
  .catch((error) => console.error(error));
