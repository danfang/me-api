const serverlessExpress = require("@vendia/serverless-express");
const fs = require("fs");

const me = JSON.parse(fs.readFileSync(process.env.ME_FILE));
const config = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE));
const app = require("./lib/app")(me, config);

exports.handler = serverlessExpress({ app });
