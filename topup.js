const displayBal = document.getElementById('displayBal');
const amtBtns = document.querySelectorAll('.amt-btn');
const payNowBtn = document.getElementById('payNowBtn');
const paymentModal = document.getElementById('paymentModal');
const payAmountDisplay = document.getElementById('payAmountDisplay');
const paymentStep1 = document.getElementById('paymentStep1');
const paymentStep2 = document.getElementById('paymentStep2');
const payStatusText = document.getElementById('payStatusText');
const spinner = document.getElementById('spinner');
const successCheck = document.getElementById('successCheck');
const dots = [document.getElementById('d1'), document.getElementById('d2'), document.getElementById('d3'), document.getElementById('d4')];

let selectedAmount = 0;
let currentPin = "";
let storedBal = localStorage.getItem("mines_balance");
let currentBalance = storedBal ? Number(storedBal) : 0;

displayBal.textContent = "₹ " + currentBalance.toLocaleString("en-IN");

amtBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amtBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAmount = Number(btn.dataset.amt);
    payNowBtn.disabled = false;
    payNowBtn.textContent = `PAY ₹${selectedAmount.toLocaleString()}`;
  });
});

payNowBtn.addEventListener('click', () => {
  if(selectedAmount > 0) {
    paymentModal.classList.remove('hidden');
    payAmountDisplay.textContent = "₹ " + selectedAmount.toLocaleString("en-IN");
    currentPin = "";
    updateDots();
  }
});

window.pressKey = function(num) {
  if (num === 'back') {
    currentPin = currentPin.slice(0, -1);
  } else if (currentPin.length < 4) {
    currentPin += num;
  }
  updateDots();
}

function updateDots() {
  dots.forEach((dot, index) => {
    if (index < currentPin.length) dot.classList.add('filled');
    else dot.classList.remove('filled');
  });
}

window.submitPin = function() {
  if (currentPin.length !== 4) return;

  if (currentPin === "0000") {
    startProcessing();
  } else {
    alert("Wrong UPI PIN! Try 0000");
    currentPin = "";
    updateDots();
  }
}

function startProcessing() {
  paymentStep1.classList.add('hidden');
  paymentStep2.classList.remove('hidden');

  setTimeout(() => {
    payStatusText.textContent = "Processing Transaction...";
  }, 1500);

  setTimeout(() => {
    spinner.classList.add('hidden');
    successCheck.classList.remove('hidden');
    payStatusText.textContent = "Payment Successful!";
    
    currentBalance += selectedAmount;
    localStorage.setItem("mines_balance", currentBalance);

  }, 3500);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}