import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

// Listar pedidos
router.get('/', async (req, res) => {
    const [orders] = await pool.query('SELECT * FROM order_dish');
    res.render('order/list', { orders });
});

// Agregar pedido
router.get('/add', (req, res) => {
    res.render('order/add');
});

router.post('/add', async (req, res) => {
    const { order_date, total, invoice_report_url, status, user_id } = req.body;
    await pool.query('INSERT INTO order_dish (order_date, total, invoice_report_url, status, user_id) VALUES (?, ?, ?, ?, ?)', [order_date, total, invoice_report_url, status, user_id]);
    res.redirect('/order');
});

// Editar pedido
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const [orders] = await pool.query('SELECT * FROM order_dish WHERE order_id = ?', [id]);
    res.render('order/edit', { order: orders[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { order_date, total, invoice_report_url, status, user_id } = req.body;
    await pool.query('UPDATE order_dish SET order_date = ?, total = ?, invoice_report_url = ?, status = ?, user_id = ? WHERE order_id = ?', [order_date, total, invoice_report_url, status, user_id, id]);
    res.redirect('/order');
});

// Eliminar pedido
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM order_dish WHERE order_id = ?', [id]);
    res.redirect('/order');
});

export default router;
