import { Router } from 'express';
import pool from '../database/database.js';

const router = Router();

// Listar pagos
router.get('/', async (req, res) => {
    try {
        const [payments] = await pool.query('SELECT * FROM payment');
        res.render('payment/list', { payments });
    } catch (error) {
        console.error('Error al listar los pagos:', error);
        res.status(500).send('Error al obtener la lista de pagos.');
    }
});

// Mostrar formulario para agregar pago
router.get('/add', async (req, res) => {
    const [orders] = await pool.query('SELECT * FROM order_dish'); // Obtener todos los pedidos
    res.render('payment/add', { orders });
});

// Agregar pago
router.post('/add', async (req, res) => {
    const { order_dish_id, amount, payment_method, status } = req.body;
    try {
        await pool.query('INSERT INTO payment (order_dish_id, amount, payment_method, status) VALUES (?, ?, ?, ?)', 
                         [order_dish_id, amount, payment_method, status]);
        res.redirect('/payment');
    } catch (error) {
        console.error('Error al agregar el pago:', error);
        res.send('Error al agregar el pago: ' + error.message); // Mejor manejo del error
    }
});



// Mostrar formulario para editar pago
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [payments] = await pool.query('SELECT * FROM payment WHERE payment_id = ?', [id]);
        if (payments.length === 0) {
            return res.status(404).send('Pago no encontrado.');
        }
        res.render('payment/edit', { payment: payments[0] });
    } catch (error) {
        console.error('Error al obtener el pago para editar:', error);
        res.status(500).send('Error al obtener el pago.');
    }
});

// Editar pago
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { order_dish_id, amount, payment_method, status, created_at } = req.body;
    try {
        await pool.query(
            'UPDATE payment SET order_dish_id = ?, amount = ?, payment_method = ?, status = ?, created_at = ? WHERE payment_id = ?',
            [order_dish_id, amount, payment_method, status, created_at, id]
        );
        res.redirect('/payment');
    } catch (error) {
        console.error('Error al actualizar el pago:', error);
        res.status(500).send('Error al actualizar el pago.');
    }
});

// Eliminar pago
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM payment WHERE payment_id = ?', [id]);
        res.redirect('/payment');
    } catch (error) {
        console.error('Error al eliminar el pago:', error);
        res.status(500).send('Error al eliminar el pago.');
    }
});

export default router;
