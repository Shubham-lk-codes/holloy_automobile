import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'CUSTOMER' | 'SELLER' | 'MODERATOR' | 'ADMIN';
    };
  }

  interface User {
    role?: 'CUSTOMER' | 'SELLER' | 'MODERATOR' | 'ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'CUSTOMER' | 'SELLER' | 'MODERATOR' | 'ADMIN';
  }
}
