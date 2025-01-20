const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  const writeStream = fs.createWriteStream(outputFile);

  cssFiles.forEach((file, index) => {
    const filePath = path.join(stylesDir, file.name);
    const readStream = fs.createReadStream(filePath, 'utf-8');

    readStream.on('data', (chunk) => {
      writeStream.write(chunk);
    });

    readStream.on('end', () => {
      // If this is the last file, close the writeStream
      if (index === cssFiles.length - 1) {
        writeStream.end();
      }
    });

    readStream.on('error', (err) => {
      console.error(`Error reading file ${file.name}:`, err);
    });
  });

  if (cssFiles.length === 0) {
    // If there are no CSS files, ensure the bundle is cleared
    writeStream.end();
  }
});
