const fs = require('fs');
const path = require('path');
const dirName = path.join(__dirname, '/secret-folder');

fs.readdir(dirName, { withFileTypes: true }, (err, item) => {
  const fileArr = item.filter((d) => d.isFile());
  fileArr.forEach((f) => {
    const typeF = path.extname(f.name);
    const nameF = f.name.replace(typeF, '');
    let result = nameF + ' - ' + typeF.slice(1);
    fs.stat(dirName + '/' + f.name, (err, stats) => {
      result = result + ' - ' + stats.size + 'B';
      console.log(result);
    });
  });
});
