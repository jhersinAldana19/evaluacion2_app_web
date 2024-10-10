import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
