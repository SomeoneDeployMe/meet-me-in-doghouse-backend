export type AppConfig = {
  db: {
    host: string;
    port: number;
    name: string;
    schema: string;
    user: string;
    password: string;
    sync: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: number;
  };
  mailer: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
};

type PropsPath<T extends Record<string, unknown>> = {
  [P in keyof T]: T[P] extends Record<string, unknown>
    ? `${string & P}` | `${string & P}.${PropsPath<T[P]>}`
    : `${string & P}`;
}[T extends any[] ? number & keyof T : keyof T];

export type ConfigProps = { [P in PropsPath<AppConfig>]: string };

export const appConfigLoader = () => ({
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    sync: process.env.DB_SYNC === String(true),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10),
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: parseInt(process.env.MAILER_PORT, 10),
    user: process.env.MAILER_USER,
    password: process.env.MAILER_PASSWORD,
  },
});
