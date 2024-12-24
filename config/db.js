const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connected to mongodb database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (err) {
    console.log(`MONGO connect ${err}}`.bgRed.white);
  }
};

module.exports = connectDB;
