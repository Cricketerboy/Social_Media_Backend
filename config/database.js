import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config({
    path:"../config/.env"
});

const databaseConnection = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Connected to MONGODB");
    }).catch((error) => {
        console.log(error);
    })
}

export default databaseConnection;