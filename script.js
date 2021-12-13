'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = ''; // add empty html
  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  sorted = !sorted;
  movements = [];
};

const UpdateUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  //DISPLAY BALANCE
  calcDisplayBalance(acc);
  //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} EUR`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * acc.interestRate) / 100)
    .filter(intyes => intyes >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};
const createusernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createusernames(accounts);
// EVENT HANDLER
let currentAccount; //variable in global context process
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevent form form submitting
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value || 'js'
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value || 1111)) {
    //DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    UpdateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentAccount);
  const amount = Number(inputTransferAmount.value);
  // const amount = document.querySelector('.form__input--amount').value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('transfer valid', currentAccount, receiverAcc);
    //doing the transfer
    currentAccount.movements.push(-amount), receiverAcc.movements.push(amount);
    UpdateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(currentAccount);
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername === currentAccount.username &&
    Number(inputClosePin === currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1); // splice(start,remove n elements ,insert )
    containerApp.style.opacity = 0;
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(dep => dep >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    UpdateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  console.log({ movements: currentAccount.movements });
  console.log(sorted);
  sorted = !sorted;
  console.log(sorted);
});

//array.fill
const x = new Array(0, 0, 0, 0, 0, 0);

x.fill(1, 3, 6);
console.log(x);
x.fill(22, 1, 3);
console.log(x);
const y = Array.from({ length: 10 }, () => 1);
console.log(y);
const z = Array.from({ length: 10 }, (_, i) => i + 1);
console.log(z);
//
const some = account1.movements.some(dep => dep > 0);
console.log(some);
// some first element that complies = true
console.log(account4.movements.every(dep => dep > 0));
//every element must comply = true
const overalbalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalbalance);
//flatmapi is a function map and function flat
const sortingA = accounts //ascending
  .flatMap(acc => acc.movements)
  .sort((a, b) => a - b);
const sortingD = accounts //descending
  .flatMap(acc => acc.movements)
  .sort((a, b) => b - a);
console.log(sortingA, sortingD);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// // console.log(movbank);
// const withdraws = movements.filter(mov => mov < 0);
// console.log(withdraws);
// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);
// //maximumvalue

// const maximum = movements.reduce((acc, cur) => (acc > cur ? acc : cur), [0]);
// console.log(maximum);

// //
// const testdata1 = [5, 2, 4, 1, 15, 8, 3];
// const testdata2 = [16, 6, 10, 5, 6, 1, 4];
// const adultages = ages =>
//   ages
//     .map(age => (age > 2 ? 16 + age * 4 : age * 2))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avg1 = adultages(testdata1);
// const avg2 = adultages(testdata2);
// console.log(avg1, avg2);
// //
// console.log('----CHAINING METHODS ARRAYS---- ');
// const totaldepositUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     //method of view consol.log in arrow function
//     // console.log(arr);
//     return mov * 1.1;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totaldepositUSD);
