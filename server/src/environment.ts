import { cleanEnv, makeValidator, str, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const nonEmptyStr = makeValidator((value) => {
	if (value.trim() === '') throw new Error('Value cannot be an empty string');
	return value;
});

const envConfig = {
	NODE_ENV: str({ choices: ['development', 'production'] }),
	PORT: num(),
	// MAILCHIMP_API_KEY: nonEmptyStr(),
	// ALLOWED_ORIGINS: nonEmptyStr(),
};

export const environment = cleanEnv(process.env, envConfig);

export const validateEnvironment = () => {
	cleanEnv(process.env, envConfig);
};
