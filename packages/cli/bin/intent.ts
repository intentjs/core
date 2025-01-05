#!/usr/bin/env node

import { Option, program } from "commander";
import { StartServerCommand } from "../commands/start-server";
import { BuildCommand } from "../commands/build";
import { NEW_PROJECT_OPTIONS } from "../lib/configuration/new-project-config";
import { NewProjectCommand } from "../commands/new-project";

program
  .command("start")
  .description("Command to start the dev server")
  .option("-p, --port [port]", "Port to run the server on.")
  .option("-c, --config [path]", "Path to the .intentrc file.")
  .option("-t, --tsconfig [tsConfigPath]", "Path to tsconfig file.")
  .option("-w, --watch", "Run in watch mode (live-reload).")
  .option("-wa, --watch-assets", "Watch non-ts (e.g., .graphql) files mode.")
  .option("-d, --debug [hostport] ", "Run in debug mode (with --inspect flag).")
  .option(
    "-dtc, --disable-type-check",
    "Disable type checking. Enabled by default"
  )
  .option(
    "--preserveWatchOutput",
    'Use "preserveWatchOutput" option when using tsc watch mode.'
  )
  .action((str, options) => {
    const command = new StartServerCommand();
    command.handle(str);
  });

program
  .command("build")
  .description("Command to build the application")
  .option("-c, --config [path]", "Path to the .intentrc file.")
  .option("-t, --tsconfig [tsConfigPath]", "Path to tsconfig file.")
  .option("-d, --debug [hostport] ", "Run in debug mode (with --inspect flag).")
  .option(
    "-dtc, --disable-type-check",
    "Disable type checking. Enabled by default"
  )
  .action((str) => {
    const buildCommand = new BuildCommand();
    buildCommand.handle(str);
  });

const newProjectProgram = program
  .command("new")
  .description("Command to initiailize a new project")
  .argument("name", "Name of the project")
  .option("--default", "Uses default configuration");

Object.values(NEW_PROJECT_OPTIONS).map((n) =>
  newProjectProgram.addOption(
    new Option(n.option, n.description).choices(n.choices)
  )
);

newProjectProgram.action(async (name, options) => {
  const command = new NewProjectCommand();
  await command.handle(name, options);
});
program.parseAsync();
