"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");

const appSource = readFileSync(new URL("./app.js", `file://${__filename}`), "utf8");

class Element {
  constructor() {
    this.listeners = {};
    this.children = [];
    this.dataset = {};
    this.classNames = new Set();
    this.classList = {
      toggle: (name, force) => {
        if (force) this.classNames.add(name);
        else this.classNames.delete(name);
      },
    };
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = children;
  }

  setAttribute() {}

  setCustomValidity() {}

  reset() {}

  querySelector() {
    return new Element();
  }
}

function createApp() {
  const ids = [
    "expense-form",
    "description",
    "expense-list",
    "empty-message",
    "pending-count",
    "total-amount",
    "filters",
    "storage-error",
  ];
  const elements = Object.fromEntries(ids.map((id) => [id, new Element()]));
  const form = elements["expense-form"];
  form.values = {};
  const storage = {};
  const context = {
    document: {
      getElementById: (id) => elements[id] || new Element(),
      createElement: () => new Element(),
    },
    localStorage: {
      getItem: (key) => storage[key] || null,
      setItem: (key, value) => {
        storage[key] = value;
      },
    },
    FormData: class {
      get(name) {
        return form.values[name];
      }
    },
    console,
  };
  vm.runInNewContext(appSource, context);

  return {
    elements,
    getExpenses() {
      return JSON.parse(storage["expense-approval.expenses"] || "[]");
    },
    submit(values) {
      form.values = values;
      form.listeners.submit({ preventDefault() {} });
      return this.getExpenses();
    },
  };
}

for (const [amount, expectedStatus] of [
  ["999.99", "APPROVED"],
  ["1000.00", "APPROVED"],
  ["1000.01", "PENDING_MANAGER_APPROVAL"],
]) {
  test(`submitting €${amount} results in ${expectedStatus}`, () => {
    const app = createApp();
    const [expense] = app.submit({
      description: "Test expense",
      amount,
      category: "Other",
      notes: "",
    });

    assert.equal(expense.status, expectedStatus);
  });
}

test("manager-pending expenses show review actions and can be approved", () => {
  const app = createApp();
  app.submit({
    description: "High-value expense",
    amount: "1000.01",
    category: "Other",
    notes: "",
  });
  const [item] = app.elements["expense-list"].children;
  const status = item.children[2].children[0];
  const approveButton = item.children[2].children.find((child) => child.dataset.action === "approve");

  assert.equal(status.textContent, "PENDING MANAGER APPROVAL");
  assert.ok(approveButton);

  app.elements["expense-list"].listeners.click({
    target: { closest: () => approveButton },
  });
  assert.equal(app.getExpenses()[0].status, "APPROVED");
});
