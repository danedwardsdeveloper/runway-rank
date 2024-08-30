import { cleanEnv, makeValidator, num } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const nonEmptyString = makeValidator((value) => {
	if (value.trim() === '') throw new Error('Value cannot be an empty string');
	return value;
});

const envConfig = {
	NODE_ENV: nonEmptyString({ choices: ['development', 'test', 'production'] }),
	PORT: num(),
	PRODUCTION_FRONT_END: nonEmptyString(),
	PRODUCTION_BACK_END: nonEmptyString(),
};

const environment = cleanEnv(process.env, envConfig);

export const port = environment.PORT;
export const isProduction: boolean = environment.isProduction;

export const backendTarget = environment.isProduction
	? environment.PRODUCTION_BACK_END
	: `http://localhost:3000`;

export const frontendTarget = environment.isProduction
	? environment.PRODUCTION_FRONT_END
	: `http://localhost:5173`;
