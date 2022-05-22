const fsPromises = require('fs/promises');
const path = require('path');
const projectPath = path.join(__dirname, 'project-dist');
const createReadStream = require('fs').createReadStream;

const checkProjectPath = async() => {
  try {
    await fsPromises.access(projectPath);
  } catch(err) {
    await fsPromises.mkdir(projectPath);
  }
};

const getHtml = async () => {
  let stringHtml = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const templateArray = stringHtml.match(/{{(\w+)}}/g);
  const fileNamesArray = templateArray.map((template) => template.slice(2, template.length - 2));
  const promiseArray = fileNamesArray.map(async (fileName) => {
    const data = await fsPromises.readFile(path.join(__dirname, 'components', `${fileName}.html`), 'utf-8');
    stringHtml = stringHtml.replace(`{{${fileName}}}`, data);
  });
  await Promise.all(promiseArray);
  fsPromises.writeFile(path.join(projectPath, 'index.html'), stringHtml);
};

const copyAssets = async (dirPath = 'assets') => {
  try {
    await fsPromises.access(path.join(projectPath, dirPath));
    await fsPromises.rm(path.join(projectPath, dirPath), {recursive: true});
  } catch {() => {};} 
  finally {
    await fsPromises.mkdir(path.join(projectPath, dirPath));
  }
  const files = await fsPromises.readdir(path.join(__dirname, dirPath), {withFileTypes: true});
  files.forEach(file => {
    if (file.isDirectory()) {
      copyAssets(`${dirPath}\\${file.name}`);
    } else if (file.isFile()) {
      fsPromises.copyFile(path.join(__dirname, dirPath, file.name), path.join(projectPath, dirPath, file.name));
    }
  });
};

const bundleCss = async (dirPath = 'styles') => {
  await fsPromises.writeFile(path.join(projectPath, 'style.css'), '');
  const cssFiles = await fsPromises.readdir(path.join(__dirname, dirPath), {withFileTypes: true});
  cssFiles.filter(file => file.isFile() && /\.css$/i.test(file.name)).forEach(file => {
    const stream = createReadStream(path.join(__dirname, dirPath, file.name), 'utf-8');
    let data = '';
    stream.on('data', chunk => {
      data += chunk;
    });
    stream.on('end', () => fsPromises.appendFile(path.join(projectPath, 'style.css'), data));
  });
};

checkProjectPath();
getHtml();
copyAssets();
bundleCss();
