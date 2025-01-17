const fs = require('fs');
const path = require('node:path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  // Ensure the destination folder exists or create it
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;

    // Read the contents of the source folder
    fs.readdir(src, { withFileTypes: true }, (err, items) => {
      if (err) throw err;

      items.forEach((item) => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);

        if (item.isDirectory()) {
          // Recursively copy subdirectories
          copyDir(srcPath, destPath);
        } else if (item.isFile()) {
          // Copy files
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

function clearAndCopyDir(src, dest) {
  fs.rm(dest, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    copyDir(src, dest);
  });
}

// Start the copying process
clearAndCopyDir(srcPath, destPath);
