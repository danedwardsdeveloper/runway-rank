// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/cypress/**',
			'**/.{idea,git,cache,output,temp}/**',
		],

		// Configure global settings for all tests
		globals: true,

		alias: {
			'@': path.resolve(__dirname, './src'),
		},

		testTimeout: 10000,
		watch: true,
		silent: false,
		retry: 0,
	},
});
