const fs = require('fs');
const { promises: fsp } = fs;
const path = require('path');

const mergeStylesPath = path.join(__dirname, '../05-merge-styles/index.js');
const copyDirPath = path.join(__dirname, '../04-copy-directory/index.js');
const { mergeStyles } = require(mergeStylesPath);
const { clearAndCopyDir } = require(copyDirPath);

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFileStyles = path.join(outputDir, 'style.css');
const assetsSRC = path.join(__dirname, 'assets');
const assetsDEST = path.join(outputDir, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const outputFileScript = path.join(outputDir, 'index.html');

async function buildProject() {
  try {
    // Creates a folder named `project-dist`.
    await fsp.mkdir(outputDir, { recursive: true });

    //  Compiles styles from the `styles` folder into a single file and places it in `project-dist/style.css`
    mergeStyles(stylesDir, outputFileStyles);

    // Copies the `assets` folder into `project-dist/assets`
    clearAndCopyDir(assetsSRC, assetsDEST);

    //  read  template
    let template = await fsp.readFile(templatePath, 'utf-8');

    // search tags
    while (template.includes('{{')) {
      const startIndex = template.indexOf('{{') + 2;
      const endIndex = template.indexOf('}}');
      const fileName = template.slice(startIndex, endIndex).trim();
      const componentPath = path.join(componentsDir, `${fileName}.html`);

      try {
        const componentContent = await fsp.readFile(componentPath, 'utf-8');
        template = template.replace(`{{${fileName}}}`, componentContent);
      } catch (err) {
        console.error(`Error reading component "${fileName}":`, err.message);
      }
    }

    // write outputFile
    await fsp.writeFile(outputFileScript, template);
    console.log('The project has been successfully assembled!');
  } catch (err) {
    console.error('Error while building project:', err.message);
  }
}

buildProject();
