const express = require('express');
const connectDatabase = require('./config/database');
const path = require('path');

const app = express();
connectDatabase();

// Initialize Middleware
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send('API Running'));

// Routes

app.use('/api/login', require('./routes/api/login'));
app.use('/api/board', require('./routes/api/board'));
app.use('/api/item', require('./routes/api/item'));
app.use('/api/list', require('./routes/api/list'));
app.use('/api/user', require('./routes/api/user'));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
