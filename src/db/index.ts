import mongoose from "mongoose";

async function connect() {
  await mongoose
    .connect(
      "mongodb+srv://snipextt:snipextt@sc.kvpb4.mongodb.net/sc?retryWrites=true&w=majority"
    )
    .catch((err: Error) => {
      console.error(err);
      process.exit(1);
    });
  console.log("Connected to MongoDB");
}

export { connect };
