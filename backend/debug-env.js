const dotenv = require('dotenv');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');
console.log('Resolved Env Path:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Dotenv Error:', result.error);
} else {
    console.log('Dotenv Parsed:', result.parsed);
}
console.log('DB_HOST in process.env:', process.env.DB_HOST);
