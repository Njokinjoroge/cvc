# User Upload Script Documentation
## Setup and Dependencies
- You will need Node.js installed on your system. The following dependencies are required:
1. `mysql2`: To interact with the MySQL database.
2. `csv-parser`: To parse the CSV file.
3. `commander`: For handling command line arguments.
4. `validator`: For email validation.

- Install these dependencies using the following command:
`npm install mysql2 csv-parser commander validator`
## Script Implementation
- The script uses `commander` to handle command line arguments.
- The script connects to the MySQL database using `mysql2/promise`.
- If the `--create-table` flag is provided, the script creates/rebuilds the `users` table.
- The script reads the CSV file using  `csv-parser`, capitalizes the names and surnames, validates the email, and inserts valid records into the database.
- The script also checks for errors, such as invalid emails or issues with database insertion.
## Running The Script

1. Create the users table
`node user_upload.js --create_table -u root -p (password from MySQL) -h localhost`

2. Insert data from CSV
`node user_upload.js --file users.csv --create_table -u root -p (password from MySQL) -h localhost`

3. Dry run without inserting
`node user_upload.js --file users.csv --dry-run --create_table -u root -p (password from MySQL) -h localhost`

4. Help
`node user_upload.js --help`

5. Run the script 
`node user_upload.js --file users.csv -u root

## Additional Notes
- Make sure your MySQL server is running and accessible with the provided credentials.