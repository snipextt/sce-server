import { connect } from "./db";
import { ExpressApp as app } from "./server";

async function boot() {
  await connect();
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
}

export { boot };
