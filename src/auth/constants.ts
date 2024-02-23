import { config } from 'src/config';

export const jwtConstants = {
  secret: config.JWT_SECRET || 'jwt-secret-key',
};
