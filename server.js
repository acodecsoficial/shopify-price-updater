require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Variáveis de ambiente para a Shopify
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Rota para atualizar o preço do produto
app.post('/update-price', async (req, res) => {
    const { productId, variantId, width, height, basePrice } = req.body;

    // Verifica se todos os dados necessários estão presentes
    if (!productId || !variantId || !width || !height || !basePrice) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    const newPrice = (width * height * basePrice).toFixed(2); // Calcula o novo preço

    try {
        // Faz a requisição para atualizar o produto na Shopify
        const response = await axios.put(
            `https://${SHOPIFY_STORE}/admin/api/2023-10/products/${productId}.json`,
            {
                product: {
                    id: productId,
                    variants: [
                        {
                            id: variantId,
                            price: newPrice, // Atualiza o preço
                            compare_at_price: (newPrice * 1.2).toFixed(2) // Preço promocional
                        }
                    ]
                }
            },
            {
                headers: {
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ message: "Preço atualizado com sucesso!", newPrice });
    } catch (error) {
        res.status(500).json({ error: error.response.data });
    }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
