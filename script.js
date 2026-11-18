const STORAGE_KEY = "expenses";

const form = document.getElementById("expenseForm");
const nameInput = document.getElementById("expenseName");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const categoryFilter = document.getElementById("categoryFilter");
const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");
const totalSpent = document.getElementById("totalSpent");
const transactionCount = document.getElementById("transactionCount");
const formError = document.getElementById("formError");

let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatMoney(amount) {
  return "₹" + amount.toFixed(2);
}

function showExpenses() {
  const selectedCategory = categoryFilter.value;
  const items = expenses.filter((expense) => {
    return selectedCategory === "All" || expense.category === selectedCategory;
  });

  expenseList.innerHTML = "";

  items.forEach((expense) => {
    const row = document.createElement("div");
    row.className = "expense-item";

    const name = document.createElement("strong");
    name.textContent = expense.name;

    const details = document.createElement("span");
    details.textContent = expense.category + " · " + expense.date;

    const amount = document.createElement("b");
    amount.textContent = formatMoney(expense.amount);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.className = "delete-button";
    removeButton.onclick = function () {
      expenses = expenses.filter((item) => item.id !== expense.id);
      save();
      showExpenses();
    };

    row.append(name, details, amount, removeButton);
    expenseList.appendChild(row);
  });

  emptyState.hidden = items.length > 0;
  emptyState.textContent =
    expenses.length === 0
      ? "No expenses yet."
      : "No expenses in this category.";

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalSpent.textContent = formatMoney(total);
  transactionCount.textContent = expenses.length;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);

  if (name === "") {
    formError.textContent = "Please enter an expense name.";
    nameInput.focus();
    return;
  }

  if (amount <= 0 || isNaN(amount)) {
    formError.textContent = "Please enter an amount greater than zero.";
    amountInput.focus();
    return;
  }

  const today = new Date();
  const date = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  expenses.unshift({
    id: Date.now(),
    name: name,
    amount: amount,
    category: categoryInput.value,
    date: date,
  });

  save();
  form.reset();
  formError.textContent = "";
  categoryFilter.value = "All";
  showExpenses();
  nameInput.focus();
});

categoryFilter.addEventListener("change", showExpenses);
showExpenses();
