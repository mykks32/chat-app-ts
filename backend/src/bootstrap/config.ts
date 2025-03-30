import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    NODE_ENV: z
            .union([
                z.literal('development'),
                z.literal('production')
            ])
            .default('development'),
    PORT: z.string().transform((val) => parseInt(val, 10)),
});

export type Config = z.infer<typeof configSchema>;

const config = configSchema.parse(process.env);

export default config;
