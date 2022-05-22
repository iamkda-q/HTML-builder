const path = require('path');
const fsProm = require('fs/promises');
const { stdout } = process;
const targetFolder = path.join(__dirname, 'secret-folder');
fsProm.readdir(targetFolder, {withFileTypes: true})
  .then(files => {
    files.filter(file => file.isFile()).forEach(file => {
      const ext = path.extname(file.name);
      const name = path.basename(file.name, ext);
      fsProm.stat(path.join(targetFolder, file.name)).then(st => {
        stdout.write(`${name} - ${ext.replace('.', '')} - ${st.size/1024}kb\n`);
      });      
    });
  });
