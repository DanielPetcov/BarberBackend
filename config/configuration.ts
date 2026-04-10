export default () => {
  const port = process.env.PORT ?? '4000';
  const databaseHost = process.env.DATABASE_HOST;
  const databasePort = process.env.DATABASE_PORT;
  const databaseUser = process.env.DATABASE_USER;
  const databasePassword = process.env.DATABASE_PASSWORD;
  const databaseName = process.env.DATABASE_NAME;

  if (!databaseHost || databaseHost.length === 0) {
    throw new Error('Database host missing');
  }

  if (!databaseUser || databaseUser.length === 0) {
    throw new Error('Database user missing');
  }

  if (!databasePassword || databasePassword.length === 0) {
    throw new Error('Database password missing');
  }

  if (!databaseName || databaseName.length === 0) {
    throw new Error('Database name missing');
  }

  if (!databasePort) {
    throw new Error('Database port missing');
  }

  const DATABASE_URL = `postgresql://${databaseHost}:${databasePassword}@localhost:${databasePort}/${databaseName}?sslmode=require&connect_timeout=10&pool_timeout=15`;

  return {
    POST: parseInt(port, 10),
    DATABASE_URL: DATABASE_URL,
  };
};
