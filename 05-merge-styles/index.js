const fsPromises = require('fs/promises');
const createReadStream = require('fs').createReadStream;
const path =require('path');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesFolder = path.join(__dirname, 'styles');
fsPromises.writeFile(bundle, '')
  .then(() => fsPromises.readdir(stylesFolder, {withFileTypes: true}))
  .then(files => {
    files.filter(file => file.isFile() && /\.css$/i.test(file.name)).forEach(file => {
      const stream = createReadStream(path.join(stylesFolder, file.name), 'utf-8');
      let data = '';
      stream.on('data', chunk => {
        data += chunk;
      });
      stream.on('end', () => fsPromises.appendFile(bundle, data));
    });
  });