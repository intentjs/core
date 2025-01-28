import picocolors from "picocolors";

export const defaultTag = picocolors.gray(`(default)`);

export const NEW_PROJECT_OPTIONS = {
  database: {
    option: "-d, --database <type>",
    description: "Default DB for your application",
    choices: ["pg", "mysql", "sqlite"],
    question: "Choice of Database?",
    default: "pg",
    selectOptions: [
      { value: "pg", label: `Postgres ${defaultTag}` },
      { value: "mysql", label: "MySQL" },
      { value: "sqlite", label: "SQLite" },
    ],
  },
  storage: {
    option: "-s, --storage <type>",
    description: "Default Storage Provider",
    question: "Which storage provider would you like to use?",
    choices: ["s3", "local"],
    default: "local",
    selectOptions: [
      { value: "local", label: `Local Storage ${defaultTag}` },
      { value: "s3", label: "Amazon S3" },
    ],
  },
  cache: {
    option: "-c, --cache <type>",
    description: "Default Cache Provider",
    question: "Which cache would you like to integrate?",
    choices: ["redis", "inmemory", "dicedb"],
    default: "inmemory",
    selectOptions: [
      { value: "in-memory", label: `In-Memory ${defaultTag}` },
      { value: "redis", label: "Redis" },
      // { value: "dicedb", label: "DiceDB" },
    ],
  },
  mailer: {
    option: "-m, --mailer <type>",
    description: "Default Mail Provider",
    question: "Which email service would you like to use?",
    choices: ["smtp", "mailgun", "resend"],
    default: "smtp",
    selectOptions: [
      { value: "smtp", label: `SMTP ${defaultTag}` },
      { value: "mailgun", label: "Mailgun" },
      { value: "resend", label: "Resend" },
    ],
  },
  queue: {
    option: "-q, --queue <type>",
    description: "Default Queue for your application",
    question: "Which queue system would you like to use?",
    choices: ["sync", "sqs", "redis", "db"],
    default: "db",
    selectOptions: [
      { value: "db", label: `Database Queue ${defaultTag}` },
      { value: "sync", label: "Synchronous" },
      { value: "sqs", label: "Amazon SQS" },
      { value: "redis", label: "Redis Queue" },
    ],
  },
};
