import { connect } from "./db";
import { createServer } from "http";
import { ExpressApp as app } from "./server";
import * as socket from "./socket";

async function boot() {
  await connect();
  const server = createServer(app);
  socket.inject(server);
  server.listen(3000);
}

export { boot };
