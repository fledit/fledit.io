// Only if you're using Fledit in server-side
var Fledit = require('fledit');

// Get an existing file from Fledit.io
var file = new Fledit("54f9f00f509e85d4040ba535");
// Wait for the file to be loaded
file.once("complete", function(file) {
  // The complete function will receive a Fledit instance.
  console.log(file);
  // This will print the public link to the file
  console.log( file.link() );
});

// Create a new file on Fledit.io
// and wait for the file to be loaded
Fledit.create({ foo: 'Bar' }).once("complete", function(file) {
  // The complete function will receive a new Fledit instance.
  console.log('Should prompt "Bar" to the console.', file.content.foo);
  // You can change the file like any Javascript object:
  file.content.foo = 'Like crazy';
  // And set a name as well
  file.name = 'This is a pretty cute name';
  // Then make the data persist
  file.save();
  // This will print the admin link to the file
  console.log( file.admin() );
});
