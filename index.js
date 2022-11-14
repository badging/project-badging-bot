const { App, createNodeMiddleware } = require("octokit");
require("dotenv").config();
const SmeeClient = require("smee-client");
const scanner = require("./scanner");

// instantiate Github App
const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  oauth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  webhooks: { secret: process.env.WEBHOOK_SECRET },
});

app.webhooks.onAny(async ({ id, name, payload }) => {
  const octokit = await app.getInstallationOctokit(payload.installation.id);
  scanner(id, name, octokit, payload);
});

// create local server to receive webhooks
require("http")
  .createServer(createNodeMiddleware(app))
  .listen(process.env.PORT, () =>
    console.info(`App listening on PORT:${process.env.PORT}`)
  );

//connect local server to network client in development
const smee = new SmeeClient({
  source: "https://smee.io/project-badging",
  target: `http://localhost:${process.env.PORT}/api/github/webhooks`,
  logger: console,
});
smee.start();