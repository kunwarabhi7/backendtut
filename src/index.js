import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({ path: "./env" });

const port = process.env.PORT || 3000;

connectDb()
  .then(() =>
    app.listen(port, () => {
      console.log(`listening on ${port}`);
    })
  )
  .catch((err) => {
    console.log("Error in mongoDB", err);
  });
