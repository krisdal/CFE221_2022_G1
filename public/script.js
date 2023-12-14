function calculateExchange() {
    const amount = parseFloat(document.getElementById('inputAmount').value);
    const selectedCurrency = document.getElementById('currencySelect').value;
  
    if (isNaN(amount) || amount <= 0) {
      document.getElementById('result').innerHTML = 'Please enter a valid amount.';
      return;
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
        exchange += `${count} - ${coin} ${currencyName} <br>`;
        remainingAmount -= count * coin;
      }
    });
  
    document.getElementById('result').innerHTML = `<strong>Exchange:</strong><br>${exchange}`;
  }
