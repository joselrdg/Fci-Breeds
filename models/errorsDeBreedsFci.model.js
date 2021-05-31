const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const errosDePdfsSchema = mongoose.Schema(
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

errosDePdfsSchema.plugin(mongoosePaginate);

const errorsDeBreeds = mongoose.model("errorsDeBreeds", errosDePdfsSchema);

module.exports = errorsDeBreeds;
