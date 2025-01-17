const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textFile);
const { stdin, stdout } = process;
stdout.write('Hello, Student! Write me something or type "exit" to finish \n');
stdin.on('data', (data) => {
  const newStr = data.toString().trim();
  if (newStr === 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});
process.on('exit', () => console.log('Good luck in further learning Node.js!'));
process.on('SIGINT', () => process.exit());
