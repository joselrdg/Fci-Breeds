require("../config/db.config");
const mongoose = require("mongoose");

const Scraper = require("../models/Scraper.model");
const deBreedsFci = require("../models/deBreedsFci.model");
const enBreedsFci = require("../models/enBreedsFci.model");
const esBreedsFci = require("../models/esBreedsFci.model");
const frBreedsFci = require("../models/frBreedsFci.model");
const errorsEsBreeds = require("../models/errorsEsBreedsFci.model");
const errorsEnBreeds = require("../models/errorsEnBreedsFci.model");
const errorsDeBreeds = require("../models/errorsDeBreedsFci.model");
const errorsFrBreeds = require("../models/errorsFrBreedsFci.model");

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

    // pdfAObjt(10, "fr")
    pdfAObjt(lang[0].num, lang[0].lang).then((data) => {
      console.log("Pdfs en Español parseados");
      esBreedsFci
        .create(data[0])
        .then((e) => {
          console.log("Razas ES guardadas en bd");
          // errorsEsBreeds.create(data[1]);
          pdfAObjt(lang[1].num, lang[1].lang).then((data) => {
            console.log("Pdfs en Ingles parseados");
            enBreedsFci
              .create(data[0])
              .then((e) => {
                console.log("Razas EN guardadas en bd");
                // errorsEnBreeds.create(data[1]);
                pdfAObjt(lang[2].num, lang[2].lang).then((data) => {
                  console.log("Pdfs en Aleman parseados");
                  deBreedsFci
                    .create(data[0])
                    .then((e) => {
                      console.log("Razas DE guardadas en bd");
                      // errorsDeBreeds.create(data[1]);
                      pdfAObjt(lang[3].num, lang[3].lang).then((data) => {
                        console.log("Pdfs en Frances parseados");
                        frBreedsFci
                          .create(data[0])
                          .then((e) => {
                            console.log("Razas FR guardadas en bd");
                            // errorsFrBreeds.create(data[1]);
                            console.log("Trabajo terminado");
                          })
                          .catch((e) => console.error(e));
                      });
                    })
                    .catch((e) => console.error(e));
                });
              })
              .catch((e) => console.error(e));
          });
        })
        .catch((e) => console.error(e));
    });
    // pdfAObjt(lang[2].num, lang[2].lang)

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
