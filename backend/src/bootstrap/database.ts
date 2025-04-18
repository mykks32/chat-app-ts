import AppDataSource from "./data-source";

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database", error);
    }
}

export default connectDB;
