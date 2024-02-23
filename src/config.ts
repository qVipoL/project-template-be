export type Config = {
  DATABASE_URL: string;

  JWT_SECRET: string;

  UPLOADTHING_SECRET: string;
  UPLOADTHING_APP_ID: string;
};

export const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL!,

  JWT_SECRET: process.env.JWT_SECRET!,

  UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET!,
  UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID!,
};
