const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Generate SKU based on product ID
const generateSKU = (id) => {
  return `PRD${String(id).padStart(3, '0')}`;
};

// Randomly assign location from A to D
const generateLocation = () => `Storage ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`;

// Get all inventory items, with search capabilities
router.get('/', (req, res) => {
    const { search } = req.query;

    let searchQuery = 'SELECT * FROM inventory';
    let queryParams = [];

    if (search) {
        searchQuery += ' WHERE name LIKE ? OR category LIKE ? OR supplier LIKE ? OR sku LIKE ? OR location LIKE ?';
        const searchTerm = `%${search}%`;
        queryParams = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    db.query(searchQuery, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new product
router.post('/', (req, res) => {
  const { name, quantity, category, supplier } = req.body;
  const location = generateLocation();

  db.query('INSERT INTO inventory (name, quantity, category, supplier, location) VALUES (?, ?, ?, ?, ?)', 
    [name, quantity, category, supplier, location], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      const productId = results.insertId;
      const sku = generateSKU(productId);

      // Update SKU after the product is inserted
      db.query('UPDATE inventory SET sku = ? WHERE id = ?', [sku, productId], (err, updateResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update SKU' });
        }
        res.json({ message: 'Product added successfully', sku, location });
      });
    }
  );
});

module.exports = router;

// Update a product
router.put('/:id', (req, res) => {
    const { name, quantity, category, supplier } = req.body;
    db.query('UPDATE inventory SET name = ?, quantity = ?, category = ?, supplier = ? WHERE id = ?', 
        [name, quantity, category, supplier, req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM inventory WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
