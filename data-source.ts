const DataSource = require('typeorm').DataSource;

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'dev.sqlite',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migration/**/*.js'],
  synchronize: true
});
