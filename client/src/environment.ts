import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

// const nonEmptyStr = makeValidator((value) => {
// 	if (value.trim() === '') throw new Error('Value cannot be an empty string');
// 	return value;
// });

// const removeQuotes = makeValidator((value) => {
// 	return value.replace(/^["']|["']$/g, '');
// });

const envConfig = {
	NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
};

export const environment = cleanEnv(process.env, envConfig);

export const validateEnvironment = () => {
	cleanEnv(process.env, envConfig);
};
