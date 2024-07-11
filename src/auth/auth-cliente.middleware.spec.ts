import { ClienteAuthMiddleware } from './auth-cliente.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new ClienteAuthMiddleware()).toBeDefined();
  });
});
