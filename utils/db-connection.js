const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => {
  console.log("DB CONNECTION ERROR - ", err);
});

async function main() {
  await mongoose.connect("mongodb://localhost:27017/bookhub");
  console.log("DB CONNECTED");
}
