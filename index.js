'use strict';

const repl = require('repl');
const { config, tmpl } = require('echotag');
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




















function test6(content = 'Page Content') {
  return safe`
    <html>
    <head>
      <title>My Webpage</title>
    </head>
    <body>
      <div class="content">
        ${content}
      </div>
    </body>
    </html>
  `;



  function safe(strings, ...vars) {
    return strings.reduce((template, string, index) => {
      template += string;

      if (vars[index]) {
        template += escapehtml(vars[index]);
      }

      return template;
    }, '');
  }
}























function test7(content = 'Page Content') {
  return safe`
    <html>
    <head>
      <title>My Webpage</title>
    </head>
    <body>
      <div class="content">
        ${content}:html
      </div>
    </body>
    </html>
  `;







  function safe(templateStrings, ...vars) {
    let strings = Array.from(templateStrings);

    return strings.reduce((template, string, index) => {
      template += string;

      let currentVar = vars[index];
      let nextString = strings[index + 1]; // Look ahead to next string
      let allowHtml = nextString && nextString.startsWith(':html');

      if (currentVar) {
        if (allowHtml) {
          template += currentVar;

          // Remove the :html modifier
          strings[index + 1] = nextString.replace(':html', '');
        } else {
          template += escapehtml(currentVar);
        }
      }

      return template;
    }, '');
  }
}
























function test8(content = 'Page Content') {
  return tmpl`
    <html>
    <head>
      <title>My Webpage</title>
    </head>
    <body>
      <div class="content">
        ${content}:html
      </div>
    </body>
    </html>
  `;
}



















function test9(content = 'Page Content') {
  let books = [
    {
      title: 'ES6 Tagged Template Literals For Dummies',
      price: '$9.99'
    },
    {
      title: 'Can You <code>?',
      price: 'Google it'
    },
    {
      title: 'You Don\'t Know JS',
      price: 'Free online'
    },
  ];

  return tmpl`
    <html>
    <head>
      <title>My Bookstore</title>
    </head>
    <body>
      <div class="content">
        <ul>
          ${books.map(book => {
            return tmpl`
              <li><strong>${book.title}</strong> (${book.price})</li>`;
          })}:html
        </ul>
      </div>
    </body>
    </html>
  `;
}






















function test10(content = 'Sparkly Page Content') {
  // Add :sparkle modifier to make things shiny!
  config.setModifier('sparkle', function (str) {
    return '✨ ' + str + '✨';
  });

  return tmpl`
    <html>
    <head>
      <title>My Bookstore</title>
    </head>
    <body>
      <div class="content">
        ${content}:sparkle
      </div>
    </body>
    </html>
  `;
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
  test6,
  test7,
  test8,
  test9,
  test10,
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
