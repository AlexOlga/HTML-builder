const fs = require('fs');
const { promises: fsp } = fs;
const path = require('path');
const distName=path.join(__dirname, '/project-dist');
const assets=path.join(__dirname, '/assets');
const assetsNew=distName+'/assets';

fs.mkdir(distName, {recursive:true},(err)=>{
  if (err) {console.log(err.message);}
});


//copy assets
fs.mkdir(assetsNew, {recursive:true},(err)=>{
  if (err) {console.log(err.message);}
});

function copyDir(nameDir,newDir){  
  fs.readdir(nameDir, { withFileTypes: true },(err, files)=>{
    const fileArr=files.filter(f=>f.isFile());
    const dirArr=files.filter(d=>d.isDirectory());
    //копируем файлы
    fileArr.forEach(f=>{
      const fileName=nameDir+'\\'+f.name;
      const newFileName= newDir+'\\'+f.name;
      fs.copyFile(fileName, newFileName,(err)=>{
        if (err) {console.log(err.message);}
      });    
    });
    //запускаем функцию рекурсивно для директорий  
    dirArr.forEach(d=>{
      const fromDir=nameDir+'\\'+d.name;
      const inDir=newDir+'\\'+d.name;
      fs.mkdir(inDir, {recursive:true},(err)=>{
        if (err) {console.log(err.message);}
      });
      copyDir(fromDir,inDir);
    });  

  });
}

copyDir(assets,assetsNew);

//удалить не актуальные файлы
function DeleteFiles(nameDir,newDir){   
  fs.readdir(nameDir,{ withFileTypes: true }, (err,files)=>{
    const  fileArr= files.filter(f=>f.isFile()).map(f=>f.name);
    const   dirArr= files.filter(f=>f.isDirectory()).map(f=>f.name);
    fs.readdir(newDir,{ withFileTypes: true }, (err,filesResult)=>{
      const newfileArr= filesResult.filter(f=>f.isFile()).map(f=>f.name);
      const newdirArr= filesResult.filter(f=>f.isDirectory()).map(f=>f.name); 
      newfileArr.forEach(item=>{
        if (!fileArr.includes(item)){
          const fileName= newDir+'/'+item;
          console.log('delete name', fileName);
          fs.unlink(fileName, (err) => {if (err) throw err; });
        }
      });
      newdirArr.forEach(item=>{
        if (!dirArr.includes(item)){
          const fileName= newDir+'/'+item;
          console.log('delete name', fileName);
          fs.unlink(fileName, (err) => {if (err) throw err; });
        } else {
          const inDir= newDir+'/'+item;
          const fromDir=nameDir+'/'+item;
          DeleteFiles(fromDir,inDir);  
        }
      });
    });

  });
  
   
}
 
DeleteFiles(assets,assetsNew);
//сборка стилей
const bundlFile=path.join(__dirname, 'project-dist/style.css');
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



// создать объект компанентов для замены
const dirCompanents=path.join(__dirname, '/components');
const originalFile=path.join(__dirname, 'template.html');
//const ReadStream = fs.createReadStream( originalFile, 'utf-8');
var compArr=[];
fsp.readFile( originalFile, 'utf-8')
  .then((text)=>{
    let arr = text.split('{{');
    arr.forEach((item)=>{
      // шаблонный тег есть
      let index= item.indexOf('}}');
      if (index !==-1) {
        let subArr=item.split('}}');
        compArr.push(subArr[0].trim());            
      }
    });
    
    var changeCompanent = function(compArr,i) {

      const fileName=dirCompanents+'\\'+compArr[i]+'.html';
     // console.log(fileName);
      fsp.readFile(fileName, 'utf-8')
        .then((data)=>{            
          //заменяем  шаблонный тег прочитанным текстом
          text=text.replace(`{{${compArr[i]}}}`, data);          
          if(i < compArr.length-1) {
            changeCompanent(compArr,i+1);
          } else {
            //создание index.html
            const htmlFile=path.join(__dirname, 'project-dist/index.html');
            const output = fs.createWriteStream(htmlFile);
            output.write(text);
          }
        });
    };
    changeCompanent(compArr,0);
  });





   