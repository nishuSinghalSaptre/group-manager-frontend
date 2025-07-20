const fs = require('fs');
const path = require('path');

function writeGoogleServices() {
  const googleServices = process.env.GOOGLE_SERVICES_JSON;
  if (!googleServices) {
    console.error("❌ GOOGLE_SERVICES_JSON env variable not set.");
    process.exit(1);
  }

  const decoded = Buffer.from(googleServices, 'base64').toString('utf-8');
  const androidPath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');

  fs.writeFileSync(androidPath, decoded);
  console.log('✅ google-services.json created at android/app/');
}

writeGoogleServices();
