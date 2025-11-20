// USERS
export const users = [
  { id: 1, full_name: "Alice Johnson", username: "alicej", password: "pass123", role: "Admin", email: "alice@example.com", status: "Active" },
  { id: 2, full_name: "Bob Smith", username: "bobsmith", password: "pass123", role: "Staff", email: "bob@example.com", status: "Active" },
  { id: 3, full_name: "Charlie Cruz", username: "charliec", password: "pass123", role: "Cashier", email: "charlie@example.com", status: "Active" },
  { id: 4, full_name: "Diana Lee", username: "dianal", password: "pass123", role: "Staff", email: "diana@example.com", status: "Active" },
  { id: 5, full_name: "Ethan Park", username: "ethanp", password: "pass123", role: "Cashier", email: "ethan@example.com", status: "Active" },
];

// CATEGORIES
export const categories = [
  { id: 1, category_name: "Footwear", description: "Sports shoes, sneakers, cleats" },
  { id: 2, category_name: "Balls", description: "Soccer balls, basketballs, volleyballs" },
  { id: 3, category_name: "Apparel", description: "Jerseys, shorts, sportswear" },
  { id: 4, category_name: "Accessories", description: "Water bottles, gloves, fitness bands" },
  { id: 5, category_name: "Fitness Equipment", description: "Dumbbells, resistance bands, mats" },
];

// PRODUCTS
export const products = [
  { id: 1, barcode: "SP1001", product_name: "Nike Soccer Cleats", category_id: 1, cost_price: 50, selling_price: 100, quantity: 25 },
  { id: 2, barcode: "SP1002", product_name: "Adidas Basketball", category_id: 2, cost_price: 20, selling_price: 40, quantity: 40 },
  { id: 3, barcode: "SP1003", product_name: "Puma Training Shorts", category_id: 3, cost_price: 15, selling_price: 30, quantity: 60 },
  { id: 4, barcode: "SP1004", product_name: "Fitness Gloves", category_id: 4, cost_price: 5, selling_price: 15, quantity: 50 },
  { id: 5, barcode: "SP1005", product_name: "Yoga Mat", category_id: 5, cost_price: 10, selling_price: 25, quantity: 30 },
  { id: 6, barcode: "SP1006", product_name: "Volleyball", category_id: 2, cost_price: 15, selling_price: 30, quantity: 35 },
  { id: 7, barcode: "SP1007", product_name: "Running Shoes", category_id: 1, cost_price: 60, selling_price: 120, quantity: 20 },
  { id: 8, barcode: "SP1008", product_name: "Fitness Band", category_id: 4, cost_price: 8, selling_price: 20, quantity: 45 },
  { id: 9, barcode: "SP1009", product_name: "Jersey Team A", category_id: 3, cost_price: 20, selling_price: 50, quantity: 40 },
  { id: 10, barcode: "SP1010", product_name: "Dumbbells 5kg", category_id: 5, cost_price: 25, selling_price: 50, quantity: 15 },
];

// HELPER: Generate random number between min and max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// TRANSACTIONS
export const transactions = Array.from({ length: 50 }, (_, i) => {
  const user = users[randomInt(0, users.length - 1)];
  const product = products[randomInt(0, products.length - 1)];
  const quantity = randomInt(1, 5);
  const total_amount = product.selling_price * quantity;
  const paymentMethods = ["Cash", "Card", "Online"];
  const payment_method = paymentMethods[randomInt(0, 2)];
  const amount_paid = total_amount + randomInt(0, 20); // may include extra cash
  const change_due = amount_paid - total_amount;
  const remarks = "";

  return {
    id: i + 1,
    user_id: user.id,
    product_id: product.id,
    quantity,
    payment_method,
    total_amount,
    amount_paid,
    change_due,
    remarks,
    date: new Date(`2025-11-${randomInt(10, 20)}`),
  };
});

// SALES SUMMARY (computed from transactions)
export const sales = {
  daily: Array.from({ length: 10 }, (_, i) => {
    const date = `2025-11-${10 + i}`;
    const dailyTransactions = transactions.filter(t => t.date.toISOString().startsWith(`2025-11-${10 + i}`));
    const revenue = dailyTransactions.reduce((acc, t) => acc + t.total_amount, 0);
    const volume = dailyTransactions.reduce((acc, t) => acc + t.quantity, 0);
    return { date, revenue, volume };
  }),
  weekly: [
    { week: "Week 46", revenue: transactions.slice(0, 25).reduce((a, t) => a + t.total_amount, 0), volume: transactions.slice(0, 25).reduce((a, t) => a + t.quantity, 0) },
    { week: "Week 47", revenue: transactions.slice(25).reduce((a, t) => a + t.total_amount, 0), volume: transactions.slice(25).reduce((a, t) => a + t.quantity, 0) },
  ],
  monthly: [
    { month: "November", revenue: transactions.reduce((a, t) => a + t.total_amount, 0), volume: transactions.reduce((a, t) => a + t.quantity, 0) },
  ],
  yearly: [
    { year: 2025, revenue: transactions.reduce((a, t) => a + t.total_amount, 0), volume: transactions.reduce((a, t) => a + t.quantity, 0) },
  ],
};
