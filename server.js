const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ustawienie silnika szablonów
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Główna strona
app.get('/', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Premium Account',
            originalPrice: 80,
            currentPrice: 50,
            image: '/images/premium-account.jpg',
            description: 'Ekskluzywne konto premium z pełnym dostępem'
        },
        {
            id: 2,
            name: 'VIP Access',
            originalPrice: 120,
            currentPrice: 75,
            image: '/images/vip-access.jpg',
            description: 'VIP dostęp do wszystkich funkcji'
        },
        {
            id: 3,
            name: 'Elite Package',
            originalPrice: 200,
            currentPrice: 150,
            image: '/images/elite-package.jpg',
            description: 'Najwyższy poziom dostępu'
        }
    ];
    
    res.render('index', { products });
});

// API endpoint dla zakupu
app.post('/api/purchase', (req, res) => {
    const { productId, paymentMethod, email, discord, terms, privacy } = req.body;
    
    // Walidacja
    if (!email || !discord || !terms || !privacy || !paymentMethod) {
        return res.status(400).json({ 
            success: false, 
            message: 'Wszystkie pola są wymagane' 
        });
    }
    
    // Przekierowanie do Stripe
    res.json({ 
        success: true, 
        redirectUrl: 'https://buy.stripe.com/cNi3cp8Xy5i35qGen4eEo01' 
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});