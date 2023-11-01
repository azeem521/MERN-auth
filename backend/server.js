const dotenv = require("dotenv");
const app = require("./app");

const connectDatabase = require("./config/connectDatabase");
dotenv.config({ path: "config/config.env" });

connectDatabase();

app.listen(process.env.PORT, (err) => {
  console.log('app is running on ',process.env.PORT);
});
