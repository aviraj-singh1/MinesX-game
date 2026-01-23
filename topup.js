// Get elements
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

// State
let selectedAmount = 0;
let currentPin = "";
let storedBal = localStorage.getItem("mines_balance");
let currentBalance = storedBal ? Number(storedBal) : 0;

// Init
displayBal.textContent = "₹ " + currentBalance.toLocaleString("en-IN");

// 1. Select Amount Logic
amtBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    amtBtns.forEach(b => b.classList.remove('selected'));
    // Add to clicked
    btn.classList.add('selected');
    // Update state
    selectedAmount = Number(btn.dataset.amt);
    payNowBtn.disabled = false;
    payNowBtn.textContent = `PAY ₹${selectedAmount.toLocaleString()}`;
  });
});

// 2. Open Payment Modal
payNowBtn.addEventListener('click', () => {
  if(selectedAmount > 0) {
    paymentModal.classList.remove('hidden');
    payAmountDisplay.textContent = "₹ " + selectedAmount.toLocaleString("en-IN");
    currentPin = "";
    updateDots();
  }
});

// 3. Keypad Logic
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

// 4. Submit PIN Logic
window.submitPin = function() {
  if (currentPin.length !== 4) return;

  if (currentPin === "0000") {
    // Success flow
    startProcessing();
  } else {
    // Wrong PIN
    alert("Wrong UPI PIN! Try 0000");
    currentPin = "";
    updateDots();
  }
}

function startProcessing() {
  paymentStep1.classList.add('hidden');
  paymentStep2.classList.remove('hidden');

  // Simulate "Contacting Bank"
  setTimeout(() => {
    payStatusText.textContent = "Processing Transaction...";
  }, 1500);

  // Simulate "Success"
  setTimeout(() => {
    spinner.classList.add('hidden');
    successCheck.classList.remove('hidden');
    payStatusText.textContent = "Payment Successful!";
    
    // UPDATE WALLET
    currentBalance += selectedAmount;
    localStorage.setItem("mines_balance", currentBalance);

  }, 3500);

  // Redirect back
  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}