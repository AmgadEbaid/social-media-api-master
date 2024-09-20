import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'dev.sqlite',
  synchronize: true, // Disable synchronize in production
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migration/**/*.js'],
});
