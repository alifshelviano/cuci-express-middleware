const express = require('express');
const { logger, validateItem } = require('./middleware'); // import middleware

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

// pakai global middleware
app.use(logger);

// -------------------- DATABASE --------------------
let items = [
  { id: 1, customername: 'alif', nameitem: 'Kaos Putih', type: 'pakaian', status: 'pending', weightKg: 0.5 },
  { id: 2, customername: 'dika', nameitem: 'Celana Jeans', type: 'pakaian', status: 'washing', weightKg: 0.8 },
];
let nextId = 3;

// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
  res.send("Welcome to Cuci Express!");
});

// GET semua item (bisa filter ?status=washing)
app.get('/items', (req, res) => {
  const { status } = req.query;
  if (status) return res.json(items.filter(i => i.status === status));
  res.json(items);
});

// GET 1 item by id
app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST item baru (pakai validateItem)
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

// PUT update item
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

  const { customername, nameitem, type, weightKg, status } = req.body;

  if (customername !== undefined) items[itemIndex].customername = customername;
  if (nameitem !== undefined) items[itemIndex].nameitem = nameitem;
  if (type !== undefined) items[itemIndex].type = type;
  if (weightKg !== undefined) items[itemIndex].weightKg = weightKg;
  if (status !== undefined) items[itemIndex].status = status;

  res.json(items[itemIndex]);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const prevLen = items.length;
  items = items.filter(i => i.id !== id);

  if (items.length === prevLen) return res.status(404).json({ error: 'Item not found' });

  res.status(204).send("Berhasil terhapus"); // sukses hapus, kosongkan body
});

// -------------------- SERVER --------------------
app.listen(port, () => {
  console.log(`Cuci Express running at http://localhost:${port}`);
});
