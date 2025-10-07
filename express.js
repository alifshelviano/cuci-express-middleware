const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // parse JSON bodies

// -------------------- MIDDLEWARE --------------------
// Logger middleware (jalan di setiap request)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // lanjut ke handler berikutnya
});

// Middleware validasi untuk POST /items
function validateItem(req, res, next) {
  const { customername, nameitem, type, weightKg } = req.body;

  if (!customername || typeof customername !== 'string') {
    return res.status(400).json({ error: 'customername is required and must be a string' });
  }
  if (!nameitem || typeof nameitem !== 'string') {
    return res.status(400).json({ error: 'nameitem is required and must be a string' });
  }
  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'type is required and must be a string' });
  }
  if (weightKg === undefined || typeof weightKg !== 'number' || weightKg <= 0) {
    return res.status(400).json({ error: 'weightKg is required and must be a positive number' });
  }

  next(); // valid → lanjut ke route handler
}

// -------------------- DATABASE --------------------
let items = [
  { id: 1, customername:'alif', nameitem: 'Kaos Putih', type: 'pakaian', status: 'pending', weightKg: 0.5 },
  { id: 2, customername:'dika', nameitem: 'Celana Jeans', type: 'pakaian', status: 'washing', weightKg: 0.8 },
];
let nextId = 3;

// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
  res.send("Welcome to Cuci Express!");
});

app.get('/items', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(items.filter(i => i.status === status));
  }
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST pakai middleware validateItem
app.post('/items', validateItem, (req, res) => {
  const { customername, nameitem, type, weightKg, status } = req.body;

  const newItem = {
    id: nextId++,
    customername,
    nameitem,
    type,
    weightKg,
    status: status || 'pending',
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

  const { nameitem, type, weightKg, status } = req.body;
  if (nameitem !== undefined) items[itemIndex].nameitem = nameitem;
  if (type !== undefined) items[itemIndex].type = type;
  if (weightKg !== undefined) items[itemIndex].weightKg = weightKg;
  if (status !== undefined) items[itemIndex].status = status;

  res.json(items[itemIndex]);
});

app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const prevLen = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length === prevLen) return res.status(404).json({ error: 'Item not found' });
  res.status(204).send();
});

// -------------------- SERVER --------------------
app.listen(port, () => {
  console.log(`Cuci Express running at http://localhost:${port}`);
});
