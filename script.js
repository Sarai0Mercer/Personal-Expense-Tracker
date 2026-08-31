const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");

let transactions = JSON.parse(
  localStorage.getItem("expenseTrackerTransactions") || "[]"
);

// Format amount as BDT
function formatMoney(amount) {
  return `৳${amount.toFixed(2)}`;
}

// Save transactions in browser
function saveTransactions() {
  localStorage.setItem(
    "expenseTrackerTransactions",
    JSON.stringify(transactions)
  );
}

// Display transactions
function renderTransactions() {
  transactionList.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {

    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }

    const li = document.createElement("li");
    li.className = "transaction";

    const info = document.createElement("div");
    info.className = "transaction-info";

    const title = document.createElement("strong");
    title.textContent = transaction.description;

    const details = document.createElement("small");
    details.textContent =
      `${transaction.category} • ${transaction.date}`;

    info.appendChild(title);
    info.appendChild(details);

    const rightSide = document.createElement("div");

    const amount = document.createElement("span");
    amount.className = transaction.type;

    if (transaction.type === "income") {
      amount.textContent = `+${formatMoney(transaction.amount)}`;
    } else {
      amount.textContent = `-${formatMoney(transaction.amount)}`;
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteTransaction(transaction.id);
    });

    rightSide.appendChild(amount);
    rightSide.appendChild(deleteButton);

    li.appendChild(info);
    li.appendChild(rightSide);

    transactionList.appendChild(li);
  });

  // Update summary
  document.getElementById("income").textContent =
    formatMoney(totalIncome);

  document.getElementById("expense").textContent =
    formatMoney(totalExpense);

  document.getElementById("balance").textContent =
    formatMoney(totalIncome - totalExpense);

  // Empty state
  if (transactions.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  saveTransactions();
  renderTransactions();
}

// Add transaction
form.addEventListener("submit", (event) => {

  event.preventDefault();

  const description =
    document.getElementById("description").value.trim();

  const amount =
    Number(document.getElementById("amount").value);

  const type =
    document.getElementById("type").value;

  const category =
    document.getElementById("category").value;

  if (!description || amount <= 0) {
    return;
  }

  const transaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: type,
    category: category,
    date: new Date().toLocaleDateString()
  };

  transactions.unshift(transaction);

  saveTransactions();

  form.reset();

  renderTransactions();
});

// Initial display
renderTransactions();
