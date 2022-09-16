require('dotenv').config();
const mongoose=require('mongoose');
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(
        process.env.MONGO_CONNECTION_URL,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => console.log("Connection successfull......"))
      .catch((err) => console.log(err));
  }
}
module.exports = new Database();