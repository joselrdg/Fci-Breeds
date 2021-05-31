const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const erroEsPdfsSchema = mongoose.Schema(
  [
    {
      lang: String,
      pdf: String,
      clave: String,
    },
  ],
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

erroEsPdfsSchema.plugin(mongoosePaginate);

const errorsEsBreeds = mongoose.model("errorsEsBreeds", erroEsPdfsSchema);

module.exports = errorsEsBreeds;
