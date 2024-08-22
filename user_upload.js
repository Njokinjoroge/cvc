#!/usr/bin/env node
const fs = require('fs')
const mysql = require('mysql2/promise');
const csv = require('csv-parser');
const { program } = require('commander');
const validator = require('validator');

// command line definitions
program
  .option('--file <filename>', 'CSV file to be processed')
  .option('--create_table', 'Create the users table in the database')
  .option('--dry_run', 'Run the script without inserting data into the database')
  .option('-u <username>', 'MySQL username')
  .option('-p <password>', 'MySQL password')
  .option('-h <host>', 'MySQL host')
  .option('--help', 'Display help information');

program.parse(process.argv);
const options = program.opts();