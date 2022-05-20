const fs = require('fs');
const path = require('path');
const bundlFile=path.join(__dirname, '/project-dist/bundle.css');
const output = fs.createWriteStream(bundlFile);
output.write('\n');
const dirStyles=path.join(__dirname, '/styles');

fs.readdir(dirStyles, { withFileTypes: true },(err, files)=>{
  files.forEach(f=>{
    const typeF=path.extname(f.name);
    if (typeF=='.css'){
      const fileStyle=dirStyles+'\\'+f.name;
      const ReadStream = fs.createReadStream(fileStyle, 'utf-8');
      let data='';
      ReadStream.on('data', chunk => data += chunk);

      ReadStream.on('end',()=>{ 
        data = data +'\n';
        fs.appendFile(bundlFile,data,(err)=>{
          if(err) throw err;               
        });
      } );

    }
  });
  
}); 
