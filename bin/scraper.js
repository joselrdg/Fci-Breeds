require("../config/db.config");
const mongoose = require("mongoose");

const Scraper = require("../models/Scraper.model");
const BreedsFci = require("../models/BreedsFci.model");

const browserObject = require('../scraper/browser');
const scraperPdfs = require('../scraper/index');
const pdfAObjt = require('../pdfparse/index')

const extractimg = require('../pdfparse/extractimg');


mongoose.connection.once("open", () => {
  console.info(
    `*** Connected to the database ${mongoose.connection.db.databaseName} ***`
  );  
    
    pdfAObjt(1, "en")
    .then((data,) => {
      console.log(data[1]);
      // BreedsFci.create(data[0])
      // .then((e)=>{console.log(e);console.log('Razas guardadas en bd')})
      // .catch((e) => console.error(e))
    })
    .catch((e) =>{ console.error(e); next(err)})
    
  

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
.catch((error) => console.error(error))

