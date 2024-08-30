import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

async function runCommand(command: string, cwd?: string): Promise<void> {
	console.log(`Running: ${command}`);
	const options = cwd ? { cwd } : undefined;
	const { stdout, stderr } = await execAsync(command, options);
	if (stdout) console.log(stdout);
	if (stderr) console.error(stderr);
}

async function deploy() {
	try {
		const rootDir = path.join(__dirname, '..');
		const proxyDir = __dirname;
		const clientDir = path.join(rootDir, 'client');

		await runCommand('pnpm run build');

		await runCommand('pnpm run build', clientDir);

		const clientDistPath = path.join(rootDir, 'client', 'dist');
		const proxyClientDistPath = path.join(proxyDir, 'dist', 'client-dist');

		console.log('Copying client dist to proxy...');
		await fs.copy(clientDistPath, proxyClientDistPath);

		// await runCommand('fly deploy', proxyDir);

		console.log('Deployment completed successfully!');
	} catch (error) {
		console.error('Deployment failed:', error);
		process.exit(1);
	}
}

deploy();
