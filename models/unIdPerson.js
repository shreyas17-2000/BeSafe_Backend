const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unIdPersonSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  unIdPerson: [
    {
      type: new Schema(
        {
          dateFrom: {
            type: String,
            required: true,
          },
          dateTo: { type: String, required: true },
          height: { type: String, required: true },
          sex: { type: String, required: true },
          upperDressColor: { type: String, required: true },
          lowerDressColor: { type: String, required: true },
          faceCutWithColor: { type: String, required: true },
          hairCutWithColor: { type: String, required: true },
          eyes: { type: String, required: true },
          reportFor: { type: String, required: true },
          locName: { type: String, required: true },
          locAddress: { type: String, required: true },
          stationName: { type: String, required: true },
          stationAddress: { type: String, required: true },
          expectedAge: { type: String, required: true },
          images: [
            {
              type: String,
            },
          ],
          assignTo: {
            type: String,
          },
        },
        { timeseries: true }
      ),
    },
  ],
});

module.exports = mongoose.model("unIdPerson", unIdPersonSchema, "unIdPerson");
