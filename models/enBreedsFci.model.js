const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const enbreedsSchema = mongoose.Schema(
  {
    grupo: Number,
    NOMBRE1: String,
    NOMBRE2: String,
    ORIGIN: String,
    DATE: String,
    UTILIZATION: String,
    BRIEFHISTORICALSUMMARY: String,
    GENERALAPPEARANCE: String,
    IMPORTANTPROPORTIONS: String,
    BEHAVIOURTEMPERAMENT: String,
    HEAD: String,
    CRANIALREGION: String,
    FACIALREGION: String,
    EYES: String,
    EARS: String,
    NECK: String,
    BODY: String,
    TAIL: String,
    LIMBS: String,
    FOREQUARTERS: String,
    HINDQUARTERS: String,
    GAITMOVEMENT: String,
    COAT: String,
    Colour: String,
    SIZE: String,
    FAULTS: String,
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

enbreedsSchema.plugin(mongoosePaginate);

const enBreedsFci = mongoose.model("enBreedsFci", enbreedsSchema);

module.exports = enBreedsFci;
