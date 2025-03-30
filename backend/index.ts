import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

import getApp from "./src/server";

async function startApp() {
  const { app, httpServer } = await getApp();

  httpServer.listen(PORT, () => {
    console.log(
      `API SERVER IS RUNNING ON PORT ${PORT} IN ${process.env.NODE_ENV} MODE AND WORKER ID ${process.pid}`
    );
  });
}

startApp().catch((error) => {
  console.error(error);
  process.exit(1);
});
