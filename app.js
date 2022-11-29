require("dotenv").config();
const Server = require("./models/server");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const server = new Server();

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    // Create a worker
    cluster.fork();
  }
} else {
  server.listen();
}
