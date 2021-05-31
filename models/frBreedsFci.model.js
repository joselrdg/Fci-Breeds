const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const frbreedsSchema = mongoose.Schema(
  {
    grupo: Number,
    NOMBRE1: String,
    NOMBRE2: String,
    ORIGINE: String,
              DATE: String,
              UTILISATION: String,
              BREFAPERCUHISTORIQUE: String,
              ASPECTGENERAL: String,
              // "Aspect général",
              PROPORTIONSIMPORTANTES: String,
              // "Proportions importantes",
              COMPORTEMENTCARACTERE: String,
              // "Comportement / caractère",
              // "Comportement/caractère",
              TETE: String,
              // "Tête",
              REGIONCRANIENNE: String,
              REGIONFACIALE: String,
              YEUX: String,
              OREILLES: String,
              COU: String,
              CORPS: String,
              QUEUE: String,
              MEMBRES: String,
              MEMBRESANTERIEURS: String,
              // "Membres antérieurs",
              MEMBRESPOSTERIEURS: String,
              // "Membres postérieurs",
              ALLURES: String,
              PEAU: String,
              ROBE: String,
              TAILLEPOIDS: String,
              DEFAUTS: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

frbreedsSchema.plugin(mongoosePaginate);

const frBreedsFci = mongoose.model("frBreedsFci", frbreedsSchema);

module.exports = frBreedsFci;
