const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MD_URL, {
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected database successfully");
    })
    .catch((err) => console.log(err));
};

module.exports = connectDatabase;
