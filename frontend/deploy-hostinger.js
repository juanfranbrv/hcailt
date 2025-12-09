import FtpDeploy from 'ftp-deploy';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load FTP credentials from .env.ftp
config({ path: resolve(__dirname, '.env.ftp') });

const ftpDeploy = new FtpDeploy();

const ftpConfig = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT || '21'),
  localRoot: resolve(__dirname, 'dist'),
  remoteRoot: process.env.FTP_REMOTE_PATH || '/public_html',
  include: ['*', '**/*', '.*'],  // Include hidden files like .htaccess
  exclude: [
    '**/*.map',
    'node_modules/**',
    'node_modules/**/.*',
    '.git/**'
  ],
  deleteRemote: false, // Set to true to delete files on server not in local dist
  forcePasv: true,
  sftp: false // Set to true for SFTP
};

// Validate credentials
if (!ftpConfig.user || !ftpConfig.password || !ftpConfig.host) {
  console.error('❌ Error: Missing FTP credentials in .env.ftp file');
  console.error('Please configure:');
  console.error('  - FTP_HOST');
  console.error('  - FTP_USER');
  console.error('  - FTP_PASSWORD');
  process.exit(1);
}

console.log('🚀 Starting deployment to Hostinger...\n');
console.log(`📂 Local:  ${ftpConfig.localRoot}`);
console.log(`🌐 Remote: ${ftpConfig.host}${ftpConfig.remoteRoot}\n`);

ftpDeploy
  .deploy(ftpConfig)
  .then((res) => {
    console.log('\n✅ Deployment completed successfully!');
    console.log(`📊 Uploaded ${res.length} files`);
    console.log('\n🌍 Your site should now be live at:');
    console.log(`   https://hcailt.awordz.com`);
  })
  .catch((err) => {
    console.error('\n❌ Deployment failed:');
    console.error(err);
    process.exit(1);
  });

// Progress events
ftpDeploy.on('uploading', (data) => {
  const percent = Math.round((data.transferredFileCount / data.totalFilesCount) * 100);
  console.log(`⬆️  [${percent}%] ${data.filename}`);
});

ftpDeploy.on('uploaded', (data) => {
  console.log(`   ✓ ${data.filename}`);
});

ftpDeploy.on('log', (data) => {
  console.log(`   ${data}`);
});
