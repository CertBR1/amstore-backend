import { AuthMiddleware } from './auth-cliente.middleware';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware()).toBeDefined();
  });
});
