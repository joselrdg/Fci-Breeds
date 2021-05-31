const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const debreedsSchema = mongoose.Schema(
  {
    grupo: Number,
    NOMBRE1: String,
    NOMBRE2: String,
    URSPRUNG: String,
    DATUM: String,
    // UTILIZATION: String,
    KURZERGESCHICHTLICHERABRISS: String,
    ALLGEMEINESERSCHEINUNGSBILD: String,
    WICHTIGEPROPORTIONEN: String,
    VERHALTENCHARAKTER: String,
    KOPF: String,
    OBERKOPF: String,
    GESICHTSSCHADEL: String,
    AUGEN: String,
    OHREN: String,
    HALS: String,
    KÖRPER: String,
    RUTE: String,
    GLIEDMASSEN: String,
    VORDERGLIEDMASSEN: String,
    HINTERGLIEDMASSEN: String,
    GANGWERK: String,
    HAUT: String,
    HAARKLEID: String,
    GEWICHT: String,
    FEHLER: String,
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

debreedsSchema.plugin(mongoosePaginate);

const deBreedsFci = mongoose.model("deBreedsFci", debreedsSchema);

module.exports = deBreedsFci;
