const createError = require("http-errors");
const Pet = require("../models/Pet.model");

module.exports.getAll = (req, res, next) => {
  Pet.find()
    .then((pets) => {
      if (!pets) {
        next(createError(404, "Pet not found"));
      } else {
        res.json(pets);
      }
    })
    .catch(next);
};
module.exports.get = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  Pet.findById(id)
    .then((pet) => {
      if (!pet) {
        next(createError(404, "Pet not found"));
      } else {
        console.log(pet);
        res.json(pet);
      }
    })
    .catch(next);
};

module.exports.list = (req, res, next) => {
  const { id } = req.params;
  Pet.find({ user: id })
    .then((pets) => {
      if (!pets) {
        next(createError(404, "Pet not found"));
      } else {
        console.log("Mascotas encontradas");
        res.json(pets);
      }
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  console.log('create')
  if (req.file) {
    req.body.file = req.file.path;
  }
  Pet.create(req.body)
    .then((pet) => {
      console.log(pet)
      console.log("Created pet");
      res.status(201).json(pet);
    })
    .catch(next);
};

module.exports.deletePetUser = (req, res, next) => {
  const id = req.params.id
  console.log(id)
  Pet.findByIdAndRemove(id)
    .then((pet) => {
      console.log(pet)
      console.log("Deleted pet");
      res.status(201).json(pet);
    })
    .catch(next);
};

module.exports.editPetUser = (req, res, next) => {
  // if (req.file) {
  //   console.log('req media')
  //   req.body.media = req.media.path;
  // }
  console.log('editPetUser');
  const id = req.params.id;
  Pet.findByIdAndUpdate(id, { $push: req.body }, { new: true })
    .then((p) => {
      console.log("Existe----------------------");
      if (p === null) {
        console.log('null');
        next(createError(404, "the pet could not be updated"));
      } else {
        console.log(id);
        Pet.findById(id).then((pet) => {
          console.log(pet);
          if (!pet) {
            console.log('No encontrado')
            next(createError(404, "Pet not found"));
          } else {
            res.json(pet);
          }
        });
      }
    })
    .catch((e) => {
      console.log("error actualizar");
      next(e);
    });
};


module.exports.editPetUserSchedule = (req, res, next) => {
  const id = req.params.id;
  console.log('editPetUserSchedule');
  Pet.findById(id)
    .then((p) => {
      console.log("Existe----------------------");
      if (p === null) {
        console.log('null');
        next(createError(404, "the pet could not be updated"));
      } else {
        const data = p[req.body.action].map((e) => {
          if (e._id.toString() === req.body._id) {
            return req.body
          } else {
            return e
          }
        })
        Pet.findByIdAndUpdate(id, { $set: { [req.body.action]: data } }, { new: true })
          .then((pup) => {
            if (!pup) {
              console.log('No encontrado')
              next(createError(404, "Pet not found"));
            } else {
              res.json(pup);
            }
          })
      }
    })
    .catch((e) => {
      console.log("error actualizar");
      next(e);
    });
};

module.exports.deletePetUserSchedule = (req, res, next) => {
  console.log('deletePetUserSchedule');
  console.log(req.body);
  const id = req.params.id.toString();
  Pet.findById(id)
    .then((p) => {
      console.log("Existe----------------------");
      if (p === null) {
        console.log('null');
        next(createError(404, "the pet could not be updated"));
      } else {
        const field = req.body.action.toString()
        const bodyid = req.body._id.toString()
        let lent = false
        const datap = []
        const data = p[field].filter((e) => {
          let ide = e._id.toString()
          if (ide !== bodyid) {
           return e
          }
        })
        if (lent) {
          Pet.findByIdAndUpdate(id, { $set: { [req.body.action]:  data } }, { new: true })
            .then((pup) => {
              if (!pup) {
                console.log('No encontrado')
                next(createError(404, "Pet not found"));
              } else {
                console.log(pup)
                res.json(pup);
              }
            })
        } else {
          console.log('elseeeeeeeeee')
          Pet.findByIdAndUpdate(id, { $pop: {[req.body.action]: -1} })
          .then((pup) => {
            if (!pup) {
              console.log('No encontrado')
              next(createError(404, "Pet not found"));
            } else {
              console.log(pup)
              res.json(pup);
            }
          })
        }
      }
    })
    .catch((e) => {
      console.log("error actualizar");
      next(e);
    });
};


module.exports.editOnePetUser = (req, res, next) => {
  console.log('editOnePetUser');
  if (req.file) {
    console.log('req media')
    req.body.file = req.file.path;
  }
  const id = req.params.id;
  Pet.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then((p) => {
      console.log("Existe----------------------");
      if (p === null) {
        console.log('null');
        next(createError(404, "the pet could not be updated"));
      } else {
        console.log(id);
        Pet.findById(id).then((pet) => {
          console.log(pet);
          if (!pet) {
            console.log('No encontrado')
            next(createError(404, "Pet not found"));
          } else {
            res.json(pet);
          }
        });
      }
    })
    .catch((e) => {
      console.log("error actualizar");
      next(e);
    });
};
