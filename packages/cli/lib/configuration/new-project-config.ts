export const NEW_PROJECT_OPTIONS = {
  database: {
    option: "-db, --database <type>",
    description: "Default DB for your application",
    choices: ["pg", "mysql", "sqlite"],
    question: "Choice of Database?",
    selectOptions: [
      { value: "pg", label: "Postgres" },
      { value: "mysql", label: "MySQL" },
      { value: "sqlite", label: "SQLite" },
    ],
  },
  storage: {
    option: "-s, --storage <type>",
    description: "Default Storage Provider",
    question: "Which storage provider would you like to use?",
    choices: ["s3", "local"],
    selectOptions: [
      { value: "s3", label: "Amazon S3" },
      { value: "local", label: "Local Storage" },
    ],
  },
  cache: {
    option: "-c, --cache <type>",
    description: "Default Cache Provider",
    question: "Which cache would you like to integrate?",
    choices: ["redis", "inmemory", "dicedb"],
    selectOptions: [
      { value: "redis", label: "Redis" },
      { value: "inmemory", label: "In-Memory Cache" },
      { value: "dicedb", label: "DiceDB" },
    ],
  },
  mailer: {
    option: "-m, --mailer <type>",
    description: "Default Mail Provider",
    question: "Which email service would you like to use?",
    choices: ["smtp", "mailgun", "resend"],
    selectOptions: [
      { value: "smtp", label: "SMTP" },
      { value: "mailgun", label: "Mailgun" },
      { value: "resend", label: "Resend" },
    ],
  },
  queue: {
    option: "-q, --queue <type>",
    description: "Default Queue for your application",
    question: "Which queue system would you like to use?",
    choices: ["sync", "sqs", "redis", "db"],
    selectOptions: [
      { value: "sync", label: "Synchronous" },
      { value: "sqs", label: "Amazon SQS" },
      { value: "redis", label: "Redis Queue" },
      { value: "db", label: "Database Queue" },
    ],
  },
};
