const fsPromises = require('fs/promises');
const createReadStream = require('fs').createReadStream;
const path = require('path');
const createInterface = require('readline').createInterface;
const componentExp = /\{\{[a-zA-z0-9]+\}\}/;
// const { stdout } = require('process');
const projectPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(projectPath, 'index.html');
// const components = path.join(__dirname, 'components');
// const o = {};
// fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true})
//   .then(files => {
//     return Promise.all(
//       files.filter(file => file.isFile()).map(file => {
//         // const ext = path.extname(file.name);
//         // const name = path.basename(file.name, ext);
//         return fsPromises.readFile(path.join(__dirname, 'components', file.name), 'utf-8');
//       }));
//   })
//   .then(a => console.log(a))
/*   .then(() => console.log(o));
console.log(o); */
/* fsPromises.mkdir(projectPath, {recursive: true})
  .then(() => {
    return fsPromises.writeFile(htmlPath, '');
  })
  .then(() => {
    const stream = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    let data = '';
    stream.on('data', chunk => {
      data += chunk;
    });
    stream.on('end', () => fsPromises.appendFile(htmlPath, data));
  })
  .then(() => {
    const file = createInterface(createReadStream(path.join(__dirname, 'template.html')));
    let data = [];
    file.on( 'line' , (line) => {
      if (componentExp.test(line)) {
        data.push(`${line.match(componentExp)[0].replace(/[^a-zA-z0-9]/g, '')}.html`);
      }
    });
    file.on('close', () => {
      data.forEach((it, i) => {
        fsPromises.readFile(path.join(__dirname, 'components', it))
          .then(component => data[i] = component);
      });
      console.log(data)
    });
  })
  .then(data => console.log(data)); */
fsPromises.mkdir(projectPath, {recursive: true})
  .then(() => {
    return fsPromises.writeFile(htmlPath, '');
  })
  .then(() => {
    const file = createInterface(createReadStream(path.join(__dirname, 'template.html')));
    file.on( 'line' , (line) => {
      if (componentExp.test(line)) {
        const componentName = `${line.match(componentExp)[0].replace(/[^a-zA-z0-9]/g, '')}.html`;
        fsPromises.readFile(path.join(__dirname, 'components', componentName))
          .then(file => fsPromises.appendFile(htmlPath, `${file}\n`));
        const componentStream = createReadStream((path.join(__dirname, 'components', componentName)));
        let componentData = '';
        componentStream.on('data', chunk => {
          componentData += chunk;
        });
        componentStream.on('end', () => fsPromises.appendFile(htmlPath, `${componentData}\n`));
      } else {
        fsPromises.appendFile(htmlPath, `${line}\n`);
      }
    });
  });

// if (componentExp.test(line)) {
//   const componentName = `${line.match(componentExp)[0].replace(/[^a-zA-z0-9]/g, '')}.html`;
//   const componentStream = createReadStream((path.join(__dirname, 'components', componentName)));
//   let componentData = '';
//   componentStream.on('data', chunk => {
//     componentData += chunk;
//   });
//   componentStream.on('end', () => fsPromises.appendFile(htmlPath, `${componentData}\n`));
// } else {
//   fsPromises.appendFile(htmlPath, `${line}\n`);
// }

//   fsPromises.writeFile(bundle, '')
//   .then(() => fsPromises.readdir(stylesFolder, {withFileTypes: true}))
//   .then(files => {
//     files.filter(file => file.isFile() && /\.css$/i.test(file.name)).forEach(file => {
//       const stream = createReadStream(path.join(stylesFolder, file.name), 'utf-8');
//       let data = '';
//       stream.on('data', chunk => {
//         data += chunk;
//       });
//       stream.on('end', () => fsPromises.appendFile(bundle, data));
//     });
//   });


// fsPromises.readdir(components, {withFileTypes: true})
//   .then(files => {
//     const names = files.filter(file => file.isFile()).map(file => {
//       const ext = path.extname(file.name);
//       return path.basename(file.name, ext);      
//     });
//     console.log(names);
//   });


/* fsPromises.writeFile(path.join(projectPath, 'index.html'), '')
  .then(() => {
    const stream = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    let data = '';
    stream.on('data', chunk => {
      data += chunk;
    });
    stream.on('end', () => fsPromises.appendFile(bundle, data));
  })
  .then(files => {
    files.filter(file => file.isFile() && /\.css$/i.test(file.name)).forEach(file => {

      
    });
  });

  fsPromises.readdir(path.join(__dirname, 'template.html'), {withFileTypes: true}) */
