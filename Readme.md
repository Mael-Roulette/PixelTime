# Database Change Management

When changes are made to the database structure, the following commands need to be executed to update the application:

## Creating Migration Files

```bash
# Generate a migration file based on entity changes
php bin/console make:migration
```

## Applying Migrations

```bash
# Execute the migration files to update the database schema
php bin/console doctrine:migrations:migrate
```

## Other Useful Database Commands

```bash
# View migration status
php bin/console doctrine:migrations:status

# Validate entity mappings
php bin/console doctrine:schema:validate

# Create a specific entity
php bin/console make:entity
```