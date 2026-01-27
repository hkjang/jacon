export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const MOCK_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@jacon.io',
  role: 'admin',
};

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (email === 'admin@jacon.io' && password === 'admin') {
    return {
      user: MOCK_USER,
      token: 'mock-jwt-token-12345',
    };
  }

  throw new Error('Invalid credentials');
}
