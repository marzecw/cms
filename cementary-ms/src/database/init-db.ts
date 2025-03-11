import { createConnection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

async function initializeDatabase() {
  try {
    // Connect to PostgreSQL
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'postgres', // Connect to default database first
    });

    console.log('Connected to PostgreSQL');

    // Check if cemetery_management database exists
    const dbExists = await connection.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cemetery_management'",
    );

    // Create cemetery_management database if it doesn't exist
    if (dbExists.length === 0) {
      console.log('Creating cemetery_management database...');
      await connection.query('CREATE DATABASE cemetery_management');
      console.log('cemetery_management database created successfully');
    } else {
      console.log('cemetery_management database already exists');
    }

    // Close the connection to the default database
    await connection.close();

    // Connect to the cemetery_management database
    const cemeteryConnection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'cemetery_management',
    });

    console.log('Connected to cemetery_management database');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../db.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL script
    console.log('Executing SQL script...');
    await cemeteryConnection.query(sqlScript);
    console.log('SQL script executed successfully');

    // Close the connection
    await cemeteryConnection.close();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization function
initializeDatabase(); 