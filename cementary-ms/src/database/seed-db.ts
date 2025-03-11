import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    // Connect to the cemetery_management database
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'cemetery_management',
    });

    console.log('Connected to cemetery_management database');

    // Check if tenants table exists
    const tenantsTableExists = await connection.query(
      "SELECT to_regclass('public.tenants')",
    );

    if (tenantsTableExists[0].to_regclass) {
      // Check if there are any tenants
      const tenants = await connection.query('SELECT * FROM tenants');

      if (tenants.length === 0) {
        // Insert a default tenant
        console.log('Inserting default tenant...');
        const tenant = await connection.query(
          "INSERT INTO tenants (tenant_name, db_name, contact_email, contact_phone) VALUES ('Default Cemetery', 'cemetery_management', 'admin@cemetery.com', '123-456-7890') RETURNING tenant_id",
        );
        console.log('Default tenant inserted successfully');

        // Get the tenant ID
        const tenantId = tenant[0].tenant_id;

        // Check if users table exists
        const usersTableExists = await connection.query(
          "SELECT to_regclass('public.users')",
        );

        if (usersTableExists[0].to_regclass) {
          // Check if there are any users
          const users = await connection.query('SELECT * FROM users');

          if (users.length === 0) {
            // Hash the password
            const hashedPassword = await bcrypt.hash('admin123', 10);

            // Insert a default admin user
            console.log('Inserting default admin user...');
            await connection.query(
              'INSERT INTO users (tenant_id, username, email, password, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
              [
                tenantId,
                'admin',
                'admin@cemetery.com',
                hashedPassword,
                'Admin',
                'User',
                'admin',
                true,
              ],
            );
            console.log('Default admin user inserted successfully');
          } else {
            console.log('Users already exist, skipping user seeding');
          }
        } else {
          console.log('Users table does not exist, skipping user seeding');
        }

        // Insert a default cemetery
        console.log('Inserting default cemetery...');
        const cemetery = await connection.query(
          "INSERT INTO cemeteries (cemetery_name, address, city, state, country, established_date) VALUES ('Main Cemetery', '123 Main St', 'Anytown', 'CA', 'USA', '2000-01-01') RETURNING cemetery_id",
        );
        console.log('Default cemetery inserted successfully');

        // Get the cemetery ID
        const cemeteryId = cemetery[0].cemetery_id;

        // Insert a default garden
        console.log('Inserting default garden...');
        const garden = await connection.query(
          "INSERT INTO gardens (cemetery_id, garden_name, description) VALUES ($1, 'Garden of Peace', 'A peaceful garden for eternal rest') RETURNING garden_id",
          [cemeteryId],
        );
        console.log('Default garden inserted successfully');

        // Get the garden ID
        const gardenId = garden[0].garden_id;

        // Insert a default lot
        console.log('Inserting default lot...');
        const lot = await connection.query(
          "INSERT INTO lots (garden_id, lot_number, status) VALUES ($1, 'A-1', 'available') RETURNING lot_id",
          [gardenId],
        );
        console.log('Default lot inserted successfully');

        // Get the lot ID
        const lotId = lot[0].lot_id;

        // Insert a default space
        console.log('Inserting default space...');
        const space = await connection.query(
          "INSERT INTO spaces (lot_id, space_number, status) VALUES ($1, '1', 'available') RETURNING space_id",
          [lotId],
        );
        console.log('Default space inserted successfully');

        // Get the space ID
        const spaceId = space[0].space_id;

        // Insert default space levels
        console.log('Inserting default space levels...');
        await connection.query(
          "INSERT INTO space_levels (space_id, level_number, status) VALUES ($1, 1, 'vacant'), ($1, 2, 'vacant'), ($1, 3, 'vacant')",
          [spaceId],
        );
        console.log('Default space levels inserted successfully');
      } else {
        console.log('Tenants already exist, skipping seeding');
      }
    } else {
      console.log('Tenants table does not exist, skipping seeding');
    }

    // Close the connection
    await connection.close();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase(); 