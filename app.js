const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { exec } = require('child_process');
const app = express();
const PORT = 3023;

app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session and flash messages
app.use(session({
  secret: 'muhammed',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Serve static assets (CSS, images, etc.) using Express
// app.use(express.static('public')); // Place your CSS and assets in the "public" folder

// Set up a basic route
app.get('/', (req, res) => {
  res.render('index', { message: req.flash('message'), output: req.flash('output') });
});

// Route to handle actions
app.post('/action', (req, res) => {
  const selectedAction = req.body.action;

  // Execute selected actions with sudo
  const command = `sudo ${selectedAction}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      req.flash('message', 'Error executing the command.');
      req.flash('output', '');
    } else {
      console.log('Command executed successfully.');
      req.flash('message', 'Command executed successfully.');
      req.flash('output', stdout);
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Express app is running on port ${PORT}`);
});
