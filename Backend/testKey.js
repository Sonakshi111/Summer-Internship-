import 'dotenv/config';

console.log('First 80 characters of key:');
console.log(process.env.GCP_PRIVATE_KEY?.slice(0, 80));
