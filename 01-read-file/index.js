const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const ReadStream = fs.createReadStream(textFile, 'utf-8');
let data = '';
ReadStream.on('data', (chunk) => (data += chunk));
ReadStream.on('end', () => {
  console.log(data);
  process.exit();
});
ReadStream.on('error', (error) => console.log('Error', error.message));
