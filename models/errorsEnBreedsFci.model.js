const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const errosEnPdfsSchema = mongoose.Schema(
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

errosEnPdfsSchema.plugin(mongoosePaginate);

const errorsEnBreeds = mongoose.model("errorsEnBreeds", errosEnPdfsSchema);

module.exports = errorsEnBreeds;
