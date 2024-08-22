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

// Database configuration
const dbConfig = {
    host: options.h || 'localhost',
    user: options.u || 'root',
    password: options.p || '',
    database: 'users_db'
  };

  // Create/rebuild users table
async function createDatabase() {
    const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    console.log(`Database ${dbConfig.database} created or already exists.`);
}
async function createTable() {
    await createDatabase(); // Create the database if it doesn't exist
    const connection = await mysql.createConnection(dbConfig);
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        surname VARCHAR(100),
        email VARCHAR(100) UNIQUE
      )`;

    await connection.query(createTableQuery);
    await connection.end();
    console.log("Users table created successfully.");}

// Process CSV file and insert into database
async function processFile(filename, dryRun) {
    const connection = await mysql.createConnection(dbConfig);
  
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', async (row) => {
        const name = capitalize(row.name.trim());
        const surname = capitalize(row.surname.trim());
        const email = row.email.trim().toLowerCase();
        if (!validator.isEmail(email)) {
            console.error(`Invalid email format: ${email}`);
            return;
          }
          if (!dryRun) {
            try {
              const query = 'INSERT INTO users (name, surname, email) VALUES (?, ?, ?)';
              await connection.execute(query, [name, surname, email]);
              console.log(`Inserted: ${name} ${surname} (${email})`);
            } catch (error) {
              console.error(`Error inserting ${name} ${surname} (${email}):`, error.message);
            }
          } else {
            console.log(`Dry Run - Processed: ${name} ${surname} (${email})`);
          }
        })
        .on('end', async () => {
            console.log('CSV file processed successfully.');
            await connection.end();
          });
      }
