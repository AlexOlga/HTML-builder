const fs = require('fs');
const path = require('path');
const destName=path.join(__dirname, '/files-copy');
const dirName=path.join(__dirname, '/files');
fs.mkdir( destName, {recursive:true},(err)=>{
  if (err) {console.log(err.message);}
});
fs.readdir(dirName,(err, files)=>{
  if (err) {console.log(err.message);}
  else {
    files.forEach(item=>{
      const destFileName= destName+'\\'+item;
      const fileName= dirName+'\\'+item;
      // console.log(fileName);
      fs.copyFile(fileName, destFileName,(err)=>{
        if (err) {console.log(err.message);}
        else {console.log('file copy');}
      });    
    });
    //удалить 
    fs.readdir(destName,(err,destFiles)=>{
      destFiles.forEach(item=>{
        if (!files.includes(item)){
          const fileName= destName+'\\'+item;
          fs.unlink(fileName, (err) => {
            if (err) throw err;
          });
        }});      
    });

  }
});
