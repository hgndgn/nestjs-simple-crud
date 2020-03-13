export const config = {
  app: {
    port: 3000,
    host: 'http://localhost',
    roles: ['Admin', 'User', 'Special'],
  },
  log: {
    level: 'debug',
    dirname: 'logs',
    filename: {
      all: 'all.log',
    },
  },
  mongo: {
    url: 'mongodb://localhost',
    dbName: 'nest',
  },
  jwt: {
    secret: 'secret',
    expiresIn: '6000s',
  },
  policy: {
    password: {
      salt: 11,
      minLength: 8,
      maxLength: 128,
    },
  },
};
