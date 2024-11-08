import app from './app';
import auth from './auth';
import logger from './logger';
import storage from './storage';
import localization from './localization';
import mailer from './mailer';
import database from './database';
import cache from './cache';
import queue from './queue';

export default [
  app,
  auth,
  cache,
  database,
  localization,
  logger,
  mailer,
  queue,
  storage,
];
