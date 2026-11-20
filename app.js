(() => {
  "use strict";

  const STORAGE_KEY = "expense-approval.expenses";
  const form = document.getElementById("expense-form");
  const descriptionInput = document.getElementById("description");
  const list = document.getElementById("expense-list");
  const emptyMessage = document.getElementById("empty-message");
  const pendingCount = document.getElementById("pending-count");
  const totalAmount = document.getElementById("total-amount");
  const filters = document.getElementById("filters");
  const storageError = document.getElementById("storage-error");
  const currencyFormat = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  });
  const MANAGER_APPROVAL_THRESHOLD = 1000;

  let expenses;
  let activeFilter = "all";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    expenses = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(expenses)) throw new Error("Invalid expense data");
    const oldStatuses = { pending: "SUBMITTED", approved: "APPROVED", rejected: "REJECTED" };
    expenses = expenses.map((expense) => ({
      ...expense,
      status: oldStatuses[expense.status] || expense.status,
    }));
  } catch (error) {
    storageError.textContent = "Could not load saved expenses. Changes are disabled to protect your data.";
    storageError.hidden = false;
    form.querySelector("button[type=submit]").disabled = true;
    console.error("Could not load saved expenses:", error);
    return;
  }

  function saveExpenses(updated) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      expenses = updated;
      storageError.hidden = true;
      return true;
    } catch (error) {
      storageError.textContent = "Could not save your changes. Please check browser storage.";
      storageError.hidden = false;
      console.error("Could not save expenses:", error);
      return false;
    }
  }

  descriptionInput.addEventListener("input", () => {
    descriptionInput.setCustomValidity("");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const description = data.get("description").trim();
    if (!description) {
      descriptionInput.setCustomValidity("Please enter a description.");
      descriptionInput.reportValidity();
      return;
    }
    const amount = Number(data.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) {
      document.getElementById("amount").reportValidity();
      return;
    }

    const expense = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      description,
      amount,
      category: data.get("category"),
      notes: data.get("notes").trim(),
      status: amount > MANAGER_APPROVAL_THRESHOLD ? "PENDING_MANAGER_APPROVAL" : "APPROVED",
      createdAt: new Date().toISOString(),
    };
    if (saveExpenses([expense, ...expenses])) {
      form.reset();
      render();
    }
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-filter");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll(".btn-filter").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    render();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    const expense = expenses.find((item) => item.id === id);
    if (!expense) return;

    let updated;
    if (action === "delete") {
      updated = expenses.filter((item) => item.id !== id);
    } else if (
      (expense.status === "SUBMITTED" || expense.status === "PENDING_MANAGER_APPROVAL")
      && (action === "approve" || action === "reject")
    ) {
      const status = action === "approve" ? "APPROVED" : "REJECTED";
      updated = expenses.map((item) => item.id === id ? { ...item, status } : item);
    } else {
      return;
    }
    if (saveExpenses(updated)) render();
  });

  function render() {
    const visible = activeFilter === "all"
      ? expenses
      : expenses.filter((expense) => activeFilter === "SUBMITTED"
        ? expense.status === "SUBMITTED" || expense.status === "PENDING_MANAGER_APPROVAL"
        : expense.status === activeFilter);
    list.replaceChildren(...visible.map(renderItem));
    emptyMessage.classList.toggle("hidden", visible.length > 0);
    pendingCount.textContent = `${expenses.filter((expense) =>
      expense.status === "SUBMITTED" || expense.status === "PENDING_MANAGER_APPROVAL"
    ).length} pending`;
    const approvedTotal = expenses
      .filter((expense) => expense.status === "APPROVED")
      .reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = `Approved: ${currencyFormat.format(approvedTotal)}`;
  }

  function renderItem(expense) {
    const item = document.createElement("li");
    item.className = "expense-item";
    const info = document.createElement("div");
    info.className = "expense-info";
    const title = document.createElement("span");
    title.className = "expense-title";
    title.textContent = expense.description;
    const meta = document.createElement("span");
    meta.className = "expense-meta";
    meta.textContent = [expense.employee, expense.category].filter(Boolean).join(" · ");
    info.append(title, meta);
    if (expense.notes) {
      const notes = document.createElement("span");
      notes.className = "expense-notes";
      notes.textContent = expense.notes;
      info.append(notes);
    }

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = currencyFormat.format(expense.amount);
    const actions = document.createElement("div");
    actions.className = "expense-actions";
    const status = document.createElement("span");
    status.className = `status status-${expense.status.toLowerCase()}`;
    status.textContent = expense.status.replaceAll("_", " ");
    actions.append(status);
    if (expense.status === "SUBMITTED" || expense.status === "PENDING_MANAGER_APPROVAL") {
      actions.append(
        actionButton("approve", expense.id, "Approve", "btn-approve"),
        actionButton("reject", expense.id, "Reject", "btn-reject")
      );
    }
    actions.append(actionButton("delete", expense.id, "Delete", "btn-delete"));
    item.append(info, amount, actions);
    return item;
  }

  function actionButton(action, id, label, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `btn ${className}`;
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = label;
    return button;
  }

  render();
})();
