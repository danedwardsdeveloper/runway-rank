import { cleanEnv, makeValidator, str, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const nonEmptyStr = makeValidator((value) => {
	if (value.trim() === '') throw new Error('Value cannot be an empty string');
	return value;
});

const envConfig = {
	NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
	PORT: num(),
	PRODUCTION_FRONT_END: nonEmptyStr(),
	PRODUCTION_BACK_END: nonEmptyStr(),
	DEVELOPMENT_FRONT_END: nonEmptyStr(),
	DEVELOPMENT_BACK_END: nonEmptyStr(),
};

export const environment = cleanEnv(process.env, envConfig);

export const validateEnvironment = () => {
	cleanEnv(process.env, envConfig);
};
