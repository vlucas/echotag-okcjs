'use strict';

const repl = require('repl');
const tmpl = require('echotag').tmpl;
const escapehtml = require('escape-html');


let defaultWorld = 'World';



function test1(world = defaultWorld) {
  return 'Hello ' + world;
}

















function test2(world = defaultWorld) {
  return `
    Hello,
    ${world}
  `;
}
















function test3(world = defaultWorld) {
  return `
    Hello,
    ${escapehtml(world)}
  `;
}













function test4(world = defaultWorld) {
  return safe`
    Hello,
    ${world}
  `;



  function safe(strings, ...vars) {
    let template = '';

    console.log('strings =', strings);
    console.log('vars =', vars);

    strings.forEach((string, index) => {
      template += string;

      if (vars[index]) {
        template += vars[index];
      }
    });

    return template;
  }
}




















function test5(world = defaultWorld) {
  return safe`
    Hello,
    ${world}
  `;



  function safe(strings, ...vars) {
    console.log('strings =', strings);
    console.log('vars =', vars);

    return strings.reduce((template, string, index) => {
      template += string;

      if (vars[index]) {
        template += escapehtml(vars[index]);
      }

      return template;
    }, '');
  }
}




















/**
 * REPL Server setup
 */
const commands = {
  test1,
  test2,
  test3,
  test4,
  test5,
};

// START
const replServer = repl.start('echotag > ');

// Commands
Object.keys(commands).forEach(cmd => {
  replServer.defineCommand(cmd, {
    help: cmd,
    action: (arg) => {
      if (arg) {
        console.log(commands[cmd](arg));
      } else {
        console.log(commands[cmd]());
      }
    }
  });
});
