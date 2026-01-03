import { copySync } from 'fs-extra';
import { resolve, join, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const crmAppPath = resolve(__dirname, '../../crm/frontend');
const overrideSrcPath = resolve(__dirname, 'src');
const overrideFilesPath = resolve(__dirname, './src_override');

console.log('Starting: Copying original src.');
copySync(join(crmAppPath, 'src'), overrideSrcPath);
console.log('Completed: Copying original src.');

console.log('Starting: Overriding src.');
copySync(overrideFilesPath, overrideSrcPath);
console.log('Completed: Overriding src.');

execSync('yarn install', { stdio: 'inherit' });