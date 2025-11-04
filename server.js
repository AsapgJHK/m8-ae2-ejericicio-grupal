const express = require('express');
const app = express();
const PORT = 3000;


let productos = [
    { id: 'a1', nombre: 'Laptop Gamer', precio: 1200, stock: 5 },
    { id: 'b2', nombre: 'Teclado Mecánico', precio: 80, stock: 20 },
    { id: 'c3', nombre: 'Monitor 4K', precio: 450, stock: 12 }
];


app.use(express.json());


const generateId = () => Math.random().toString(36).substring(2, 9);


app.get('/productos', (req, res) => {
    
    const stockMinimo = parseInt(req.query.stock_minimo);
    
    if (stockMinimo > 0) {
        const productosFiltrados = productos.filter(p => p.stock >= stockMinimo);
        res.status(200).json({
            estado: 'OK',
            mensaje: `Lista de productos con stock >= ${stockMinimo}`,
            datos_recibidos: req.query, 
            data: productosFiltrados
        });
    } else {
        
        res.status(200).json({
            estado: 'OK',
            mensaje: 'Lista completa de productos',
            data: productos
        });
    }
});


app.post('/productos', (req, res) => {
    const nuevoProducto = req.body;
    
    
    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '') {
        
        return res.status(400).json({
            estado: 'ERROR',
            mensaje: 'El nombre del producto es obligatorio.',
            codigo: 400
        });
    }

    
    nuevoProducto.id = generateId();
    productos.push(nuevoProducto);

    
    res.status(201).json({
        estado: 'CREADO',
        mensaje: 'Producto agregado exitosamente.',
        datos_recibidos: req.body, 
        recurso: nuevoProducto,
        codigo: 201
    });
});


app.put('/productos/:id', (req, res) => {
    const { id } = req.params; 
    const nuevosDatos = req.body;
    const productoIndex = productos.findIndex(p => p.id === id);

    
    if (productoIndex === -1) {
        
        return res.status(404).json({
            estado: 'ERROR',
            mensaje: `Producto con ID ${id} no encontrado para actualizar.`,
            codigo: 404
        });
    }

    
    productos[productoIndex] = { ...productos[productoIndex], ...nuevosDatos };
    
   
    res.status(200).json({
        estado: 'ACTUALIZADO',
        mensaje: `Producto con ID ${id} actualizado correctamente.`,
        datos_recibidos: { id, body: req.body },
        recurso: productos[productoIndex],
        codigo: 200
    });
});


app.delete('/productos/:id', (req, res) => {
    const { id } = req.params; 
    const productoIndex = productos.findIndex(p => p.id === id);

    
    if (id === 'critical') {
       
        return res.status(500).json({
            estado: 'ERROR FATAL',
            mensaje: 'Error interno simulado: No se pudo conectar a la BD.',
            codigo: 500
        });
    }

    
    if (productoIndex === -1) {
        
        return res.status(404).json({
            estado: 'ERROR',
            mensaje: `Producto con ID ${id} no encontrado para eliminar.`,
            codigo: 404
        });
    }

    
    const productoEliminado = productos.splice(productoIndex, 1);

    
    res.status(200).json({
        estado: 'ELIMINADO',
        mensaje: `Producto con ID ${id} eliminado correctamente.`,
        recurso_eliminado: productoEliminado[0],
        codigo: 200
    });
});



app.use((req, res) => {
    res.status(404).json({
        estado: 'ERROR',
        mensaje: `Ruta ${req.originalUrl} no encontrada.`,
        codigo: 404
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor REST activo en http://localhost:${PORT}`);
});