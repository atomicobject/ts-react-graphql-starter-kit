// This file is JS becaule we can't export the worker function correctly
// when using ES modules

const { ALL_JOBS } = require("services");
const { Context } = require("graphql-api/context");
const {
  makeJobProcessorFunction,
} = require("atomic-object/jobs/processing-function");

console.log("Loaded main queue worker");
module.exports = makeJobProcessorFunction({
  buildContext: () => new Context(),
  jobs: ALL_JOBS.filter((job: any) => job.queue === "main"),
});
