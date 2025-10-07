// middleware.js

// Logger middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Validation middleware untuk POST /items
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

  next(); // lanjut ke route
}

// ✅ export function (CommonJS style untuk Node.js)
module.exports = { logger, validateItem };

// ✅ kalau mau pakai ES6 module (package.json: "type":"module"):
// export { logger, validateItem };
