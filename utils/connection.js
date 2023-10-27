import mongoose from "mongoose";
import { DB_URL } from "../config";

mongoose.connection.on("connected", () => {
	console.log("DB Connected...");
});

mongoose.connection.on("disconnected", () => {
	console.log("DB Disconnected ..x..x..x..");
});

export default async function connection() {
	try {
		await mongoose.connect(DB_URL);
	} catch (err) {
		console.log("Error in mongoose connection", err.message);
	}
}
