const fs = require('fs');
const path = require('path');
const textFile=path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textFile);
const { stdin, stdout} = process;
stdout.write('Приветсвую тебя, Sudent! Напиши мне что-нибудь или введи "exit" для завершения \n');
stdin.on('data', data =>{ const newStr=data.toString().trim();
  if (newStr === 'exit'){ 
    process.exit();} 
  else {
    output.write(data);}
});
process.on('exit', () =>console.log('Уcпехов в дальнейшем изучении Node.js!'));
process.on('SIGINT', () =>process.exit());