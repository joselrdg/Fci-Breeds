const mongoose = require("mongoose");

const scraperSchema = mongoose.Schema(
  {
    url: [[String]],
    group: [[String]]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        return ret;
      },
    },
  }
);


const Scraper = mongoose.model("Scraper", scraperSchema);

module.exports = Scraper;
