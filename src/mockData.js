// USERS
export const users = [
  { id: 1, full_name: "Admin", username: "admin", password: "pass123", role: "Admin", email: "admin@example.com", status: "Active" },
  { id: 2, full_name: "Staff", username: "staff", password: "pass123", role: "Staff", email: "staff@example.com", status: "Active" },
  { id: 3, full_name: "Cashier", username: "cashier", password: "pass123", role: "Cashier", email: "cashier@example.com", status: "Active" },
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
  { id: 9, barcode: "SP1009", product_name: "Jersey Team A", category_id: 3, cost_price: 20, selling_price: 50, quantity: 0 },
  { id: 10, barcode: "SP1010", product_name: "Dumbbells 5kg", category_id: 5, cost_price: 25, selling_price: 50, quantity: 10 },
  { id: 11, barcode: "SP1011", product_name: "Basketball Pro 3000", category_id: 2, cost_price: 30, selling_price: 60, quantity: 15 },
  { id: 12, barcode: "SP1012", product_name: "Soccer Ball Elite", category_id: 2, cost_price: 25, selling_price: 50, quantity: 0 },
  { id: 13, barcode: "SP1013", product_name: "Tennis Racket X1", category_id: 4, cost_price: 40, selling_price: 80, quantity: 8 },
  { id: 14, barcode: "SP1014", product_name: "Gym Mat 200cm", category_id: 5, cost_price: 30, selling_price: 70, quantity: 5 },
  { id: 15, barcode: "SP1015", product_name: "Adidas Running Shirt", category_id: 3, cost_price: 18, selling_price: 35, quantity: 50 },
  { id: 16, barcode: "SP1016", product_name: "Soccer Socks Pack", category_id: 1, cost_price: 5, selling_price: 12, quantity: 100 },
  { id: 17, barcode: "SP1017", product_name: "Resistance Bands Set", category_id: 5, cost_price: 12, selling_price: 25, quantity: 20 },
  { id: 18, barcode: "SP1018", product_name: "Water Bottle 1L", category_id: 4, cost_price: 4, selling_price: 10, quantity: 75 },
  { id: 19, barcode: "SP1019", product_name: "Basketball Jersey Team B", category_id: 3, cost_price: 22, selling_price: 45, quantity: 30 },
  { id: 20, barcode: "SP1020", product_name: "Running Shorts", category_id: 3, cost_price: 15, selling_price: 30, quantity: 40 },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// TRANSACTIONS
export const transactions = Array.from({ length: 50 }, (_, i) => {
  const user = users[randomInt(0, users.length - 1)];
  const product = products[randomInt(0, products.length - 1)];
  const quantity = randomInt(1, 5);
  const total_amount = product.selling_price * quantity;
  const paymentMethods = ["Cash", "Card", "Online"];
  const payment_method = paymentMethods[randomInt(0, 2)];
  const amount_paid = total_amount + randomInt(0, 20); 
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

// Cart Items
export const mockCartItems = [
  {
    id: 1,
    name: "Nike Soccer Cleats",
    price: 1200,
    quantity: 1,
  },
  {
    id: 2,
    name: "Adidas Running Shirt",
    price: 600,
    quantity: 2,
  },
];



// SALES SUMMARY 
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

// Notifications
export const notifications = [
  {
    id: 1,
    type: "info", // info, warning, success, error
    message: "New product 'Basketball Pro 3000' added to inventory.",
    date: new Date("2025-11-18T09:30:00"),
    read: false,
  },
  {
    id: 2,
    type: "warning",
    message: "Stock for 'Tennis Racket X1' is below reorder level.",
    date: new Date("2025-11-18T10:00:00"),
    read: false,
  },
  {
    id: 3,
    type: "success",
    message: "Sale completed by cashier Jane Doe: PHP 3,500",
    date: new Date("2025-11-18T11:15:00"),
    read: true,
  },
  {
    id: 4,
    type: "error",
    message: "Failed to update product 'Soccer Ball Elite' in inventory.",
    date: new Date("2025-11-17T16:45:00"),
    read: true,
  },
  {
    id: 5,
    type: "info",
    message: "New user 'Mark Spencer' has been added as staff.",
    date: new Date("2025-11-17T14:20:00"),
    read: false,
  },
  {
    id: 6,
    type: "warning",
    message: "Low stock alert: 'Gym Mat 200cm'.",
    date: new Date("2025-11-16T18:05:00"),
    read: false,
  },
  {
    id: 7,
    type: "success",
    message: "Inventory check completed for all categories.",
    date: new Date("2025-11-16T12:00:00"),
    read: true,
  },
  {
    id: 8,
    type: "info",
    message: "New promotion started: 'Buy 1 Take 1 Yoga Ball'.",
    date: new Date("2025-11-15T08:45:00"),
    read: false,
  },
  {
    id: 9,
    type: "warning",
    message: "User 'John Doe' attempted to access unauthorized page.",
    date: new Date("2025-11-14T17:30:00"),
    read: true,
  },
  {
    id: 10,
    type: "success",
    message: "Point-of-sale system updated successfully.",
    date: new Date("2025-11-14T09:00:00"),
    read: true,
  }
];
