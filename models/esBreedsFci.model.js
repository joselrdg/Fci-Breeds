const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const esbreedsSchema = mongoose.Schema(
  {
    grupo: Number,
    NOMBRE1: String,
    NOMBRE2: String,
    ORIGEN: String,
    FECHA: String,
    UTILIZACION: String,
    BREVERESUMENHISTORICO: String,
    APARIENCIAGENERAL: String,
    COMPORTAMIENTO: String,
    CABEZA: String,
    REGIONCRANEAL: String,
    REGIONFACIAL: String,
    OJOS: String,
    OREJAS: String,
    CUELLO: String,
    CUERPO: String,
    COLA: String,
    MIEMBROSANTERIORES: String,
    MIEMBROSPOSTERIORES: String,
    MOVIMIENTO: String,
    MANTO: String,
    TAMANOYPESO: String,
    FALTAS: String,
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

esbreedsSchema.plugin(mongoosePaginate);

const esBreedsFci = mongoose.model("esBreedsFci", esbreedsSchema);

module.exports = esBreedsFci;
