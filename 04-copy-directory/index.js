const fsPromises = require('fs/promises');
const path =require('path');
const targetFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');
fsPromises.access(copyFolder)
  .then(() => {return fsPromises.rm(copyFolder, {recursive: true});})
  .catch(() => {})
  .finally(() => {
    fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})
      .then(() => {
        return fsPromises.readdir(targetFolder, {withFileTypes: true});
      })
      .then(files => {
        files.filter(file => file.isFile()).forEach(file => {
          fsPromises.copyFile(path.join(targetFolder, file.name), path.join(copyFolder, file.name));
        });
      });
  });
