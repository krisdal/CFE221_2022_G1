const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/currency-exchange', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.use(express.static('public'));
app.use(express.json());

// Registration route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Log the received data
  console.log('Received registration data:', { username, password });

  // validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    // Redirect to login.html after successful registration
    res.json({ success: true, redirect: '/login.html' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Currency exchange route
app.post('/calculate-exchange', (req, res) => {
  const { amount, selectedCurrency } = req.body;
  const exchangeResult = calculateExchange(amount, selectedCurrency);
  res.json({ exchangeResult });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Currency exchange function
function calculateExchange(amount, selectedCurrency) {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a valid amount.';
  }

  let coins;
  let currencyName;

  switch (selectedCurrency) {
    case 'jpy':
      coins = [500, 100, 50, 10, 5, 1];
      currencyName = 'Yen (JPY)';
      break;
    case 'thb':
    default:
      coins = [10, 5, 2, 1];
      currencyName = 'Baht (THB)';
      break;
    case 'krw':
      coins = [500, 100, 50, 10, 5, 1];
      currencyName = 'WON (KRW)';
      break;
  }

  let remainingAmount = amount;
  let exchange = '';

  coins.forEach(coin => {
    const count = Math.floor(remainingAmount / coin);
    if (count > 0) {
      exchange += `${count} - ${coin} ${currencyName} \n`;
      remainingAmount -= count * coin;
    }
  });

  return `Exchange:\n${exchange}`;
}

