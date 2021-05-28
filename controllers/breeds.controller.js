const createError = require("http-errors");
const Breeds = require("../models/BreedsFci.model");

module.exports.group = (req, res, next) => {
  console.log(req.params.group)
  const options = {
    page: req.params.page,
    limit: req.params.limit
  } 
  Breeds.paginate({grupo: req.params.group}, options).then(function (result) {
    console.log('Resultados razas')
    res.json(result);
  })
    .catch(next);
};

// const options = {
//   page: 1,
//   limit: 10,
//   collation: {
//     locale: 'en',
//   },
// };

module.exports.list = (req, res, next) => {
  const options = {
    pagination: false
  } 
  Breeds.paginate({}, options).then(function (result) {
    console.log('Resultados razas')
    res.json(result);
  })
    .catch(next);
};

module.exports.breed = (req, res, next) => {
  const query = req.params.breed
  console.log(query)
  Breeds.findById(query)
  .then((breed)=>{
    if(breed){ 
      console.log('breed find')
      res.json(breed);
  } else {
    console.log('no breed')
  }
  })
  .catch(next);
};
