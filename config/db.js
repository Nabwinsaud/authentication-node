import mongoose from "mongoose";

const connectDB = (url) => {
  try {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection established to database ✅");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;

// import { MongoClient, ServerApiVersion } from "mongodb";
// const connectDB = async (url) => {
//   const uri = url;
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
//   });
//   client.connect((err) => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log("Connection established to database ✅");

//     client.close();
//   });
// };

// export default connectDB;
