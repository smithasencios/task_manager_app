const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const envDir = path.resolve(__dirname, "..", "src", "environments");
const env = process.env;

function envFile(production) {
  return `export const environment = {
  production: ${production},
  apiBaseUrl: '${env["API_BASE_URL"] ?? ""}',
  firebase: {
    apiKey: '${env["FIREBASE_API_KEY"] ?? ""}',
    authDomain: '${env["FIREBASE_AUTH_DOMAIN"] ?? ""}',
    projectId: '${env["FIREBASE_PROJECT_ID"] ?? ""}',
    storageBucket: '${env["FIREBASE_STORAGE_BUCKET"] ?? ""}',
    messagingSenderId: '${env["FIREBASE_MESSAGING_SENDER_ID"] ?? ""}',
    appId: '${env["FIREBASE_APP_ID"] ?? ""}',
    measurementId: '${env["FIREBASE_MEASUREMENT_ID"] ?? ""}'
  }
};
`;
}

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, "environment.ts"), envFile(false), "utf8");
fs.writeFileSync(path.join(envDir, "environment.prod.ts"), envFile(true), "utf8");

console.log("✅ environment.ts and environment.prod.ts generated from .env");
