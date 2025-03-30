import { DataSource } from "typeorm";
import config from "./config";
import Entities from "@entity";
import path from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  url: config.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [...Object.values(Entities)],
  migrations: [path.join(__dirname, "../database/migrations/*.{ts,js}")],
  migrationsTableName: "migrations",
  migrationsRun: false,
});

export default AppDataSource;
