const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  err => {
    if (err) throw err;
    stdout.write(`Привет! 
Введите данные для записи в файл. Для выхода введите exit или нажмите Ctrl+C\n`);
  }
);
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    `${data}`,
    err => {
      if (err) throw err;
      stdout.write(`Данные добавлены!
Продолжим? Для выхода введите exit или нажмите Ctrl+C\n`);
    });
});
process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Good luck!'));
