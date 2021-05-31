const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const errosFrPdfsSchema = mongoose.Schema(
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

errosFrPdfsSchema.plugin(mongoosePaginate);

const errorsFrBreeds = mongoose.model("errorsFrBreeds", errosFrPdfsSchema);

module.exports = errorsFrBreeds;
