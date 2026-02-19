import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { config } from './common/configs/env.config';

export const ormConfig: DataSourceOptions = {
  type: config.type_db,
  host: config.host_db,
  port: config.port_db,
  username: config.username_db,
  password: config.password_db,
  database: config.name_db,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/common/migrations/*.js'],
  synchronize: false,
};

export default new DataSource(ormConfig);