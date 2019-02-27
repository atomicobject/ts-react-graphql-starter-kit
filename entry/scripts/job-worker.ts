import * as Bull from "bull";
import * as config from "config";

const mainQueue = new Bull("main", {
  redis: config.get("redis.url"),
  prefix: config.get("redis.prefix"),
});

// console.log({
//   redis: config.get("redis.url"),
//   prefix: config.get("redis.prefix"),
//   // func: require(`./main-queue-processor.js`),
// });
console.log(`Starting ${config.get<number>("jobs.workers")} workers`);

mainQueue.process(
  config.get<number>("jobs.workers"),
  `${process.cwd()}/dist/scripts/main-queue-processor.js`
);

void mainQueue.resume();
