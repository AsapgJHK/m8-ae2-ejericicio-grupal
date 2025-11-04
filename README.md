## 💻 Código del Servidor REST (`server.js`)

Este archivo contiene la lógica del servidor, un *array* simulado como base de datos, y la implementación de todas las rutas y códigos de estado solicitados.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// --- Simulación de Base de Datos ---
// Usaremos este array para simular la persistencia de datos (Parte 2)
let productos = [
    { id: 'a1', nombre: 'Laptop Gamer', precio: 1200, stock: 5 },
    { id: 'b2', nombre: 'Teclado Mecánico', precio: 80, stock: 20 },
    { id: 'c3', nombre: 'Monitor 4K', precio: 450, stock: 12 }
];

// --- PARTE 1: Inicialización y Middleware ---
// Habilitar el procesamiento de datos JSON en el cuerpo de la petición (req.body)
app.use(express.json());

// Función de utilidad para generar IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// ----------------------------------------------------------------------
// --- PARTE 2 & 3: RUTAS CRUD (RESTful) y PARÁMETROS ---
// ----------------------------------------------------------------------

// GET /productos - Devuelve todos los productos
// Uso: req.query (opcional)
app.get('/productos', (req, res) => {
    // Si se recibe un query string 'stock_minimo', aplicamos un filtro.
    const stockMinimo = parseInt(req.query.stock_minimo);
    
    if (stockMinimo > 0) {
        const productosFiltrados = productos.filter(p => p.stock >= stockMinimo);
        res.status(200).json({
            estado: 'OK',
            mensaje: `Lista de productos con stock >= ${stockMinimo}`,
            datos_recibidos: req.query, // Mostrar query string (Parte 3)
            data: productosFiltrados
        });
    } else {
        // Código 200 OK para la lista completa
        res.status(200).json({
            estado: 'OK',
            mensaje: 'Lista completa de productos',
            data: productos
        });
    }
});

// POST /productos - Recibe y guarda un producto nuevo
// Uso: req.body (JSON)
app.post('/productos', (req, res) => {
    const nuevoProducto = req.body;
    
    // Simulación de Error Controlado: Validación de campo 'nombre' (Parte 4: 400 Bad Request)
    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '') {
        // Código 400 Bad Request
        return res.status(400).json({
            estado: 'ERROR',
            mensaje: 'El nombre del producto es obligatorio.',
            codigo: 400
        });
    }

    // Procesa y guarda el producto
    nuevoProducto.id = generateId();
    productos.push(nuevoProducto);

    // Código 201 Created
    res.status(201).json({
        estado: 'CREADO',
        mensaje: 'Producto agregado exitosamente.',
        datos_recibidos: req.body, // Mostrar req.body (Parte 3)
        recurso: nuevoProducto,
        codigo: 201
    });
});

// PUT /productos/:id - Actualiza un producto según su ID
// Uso: req.params (ID)
app.put('/productos/:id', (req, res) => {
    const { id } = req.params; // req.params
    const nuevosDatos = req.body;
    const productoIndex = productos.findIndex(p => p.id === id);

    // Búsqueda: Si no encuentra el producto (Parte 4: 404 Not Found)
    if (productoIndex === -1) {
        // Código 404 Not Found
        return res.status(404).json({
            estado: 'ERROR',
            mensaje: `Producto con ID ${id} no encontrado para actualizar.`,
            codigo: 404
        });
    }

    // Actualización (merge de datos)
    productos[productoIndex] = { ...productos[productoIndex], ...nuevosDatos };
    
    // Código 200 OK
    res.status(200).json({
        estado: 'ACTUALIZADO',
        mensaje: `Producto con ID ${id} actualizado correctamente.`,
        datos_recibidos: { id, body: req.body },
        recurso: productos[productoIndex],
        codigo: 200
    });
});

// DELETE /productos/:id - Elimina un producto según su ID
// Uso: req.params (ID)
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params; // req.params
    const productoIndex = productos.findIndex(p => p.id === id);

    // Simulación de Error Controlado: Error de servidor (Parte 4: 500 Internal Server Error)
    if (id === 'critical') {
        // Código 500 Internal Server Error
        return res.status(500).json({
            estado: 'ERROR FATAL',
            mensaje: 'Error interno simulado: No se pudo conectar a la BD.',
            codigo: 500
        });
    }

    // Búsqueda: Si no encuentra el producto (Parte 4: 404 Not Found)
    if (productoIndex === -1) {
        // Código 404 Not Found
        return res.status(404).json({
            estado: 'ERROR',
            mensaje: `Producto con ID ${id} no encontrado para eliminar.`,
            codigo: 404
        });
    }

    // Eliminación
    const productoEliminado = productos.splice(productoIndex, 1);

    // Código 200 OK
    res.status(200).json({
        estado: 'ELIMINADO',
        mensaje: `Producto con ID ${id} eliminado correctamente.`,
        recurso_eliminado: productoEliminado[0],
        codigo: 200
    });
});


// Middleware para manejar 404 (Rutas no definidas)
app.use((req, res) => {
    res.status(404).json({
        estado: 'ERROR',
        mensaje: `Ruta ${req.originalUrl} no encontrada.`,
        codigo: 404
    });
});

// ----------------------------------------------------------------------

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor REST activo en http://localhost:${PORT}`);
});
```

-----

## 📄 Documentación del Proyecto (`README.md`)

Este archivo documenta la estructura, el uso y responde las preguntas de la **Parte 5**.

````markdown
# 🛒 API REST de Productos con Express

Este proyecto implementa un servidor REST básico utilizando Express.js para simular las operaciones CRUD sobre una colección de productos. El objetivo es aplicar buenas prácticas en la definición de endpoints, el manejo de parámetros y la implementación de códigos de respuesta HTTP.

## ⚙️ Configuración y Ejecución

1. **Instalación:**
   ```bash
   npm init -y
   npm install express
````

2.  **Ejecución:**
    ```bash
    node server.js
    ```
    El servidor se iniciará en `http://localhost:3000`.

## 🧪 Endpoints Implementados (CRUD)

| Método | Endpoint | Parámetros Usados | Código de Éxito | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/productos` | `req.query` (stock\_minimo) | `200 OK` | Obtiene todos los productos (con filtro opcional). |
| **POST** | `/productos` | `req.body` (JSON) | `201 Created` | Agrega un nuevo producto. |
| **PUT** | `/productos/:id`| `req.params` y `req.body` | `200 OK` | Actualiza los datos de un producto específico. |
| **DELETE**| `/productos/:id`| `req.params` | `200 OK` | Elimina un producto. |

## ❗ Códigos de Respuesta HTTP (Parte 4)

Los códigos de respuesta se dividen en rangos que indican la naturaleza del resultado de la petición:

| Rango | Significado General | Códigos Usados en API |
| :--- | :--- | :--- |
| **1xx** | **Informativo** | (Poco usados en APIs REST) Indica que la solicitud fue recibida y el proceso continúa. |
| **2xx** | **Éxito** | **`200 OK`** (Genérico, lectura, actualización exitosa) / **`201 Created`** (Creación exitosa de un recurso). |
| **3xx** | **Redirección** | (No usados en este API) Indica que el cliente debe realizar una acción adicional para completar la solicitud. |
| **4xx** | **Error del Cliente** | **`400 Bad Request`** (Error de validación, sintaxis o cuerpo del mensaje) / **`404 Not Found`** (Recurso no existe o la ruta es incorrecta). |
| **5xx** | **Error del Servidor** | **`500 Internal Server Error`** (Error inesperado en el servidor que impide cumplir la solicitud). |

## ❓ Documentación Corta del Equipo (Parte 5)

### 1\. ¿En qué casos se utiliza cada tipo de petición HTTP?

  * **GET:** Para **solicitar o leer** datos de un recurso o colección de recursos. Debe ser *idempotente* (repetir la petición no cambia el estado del servidor).
  * **POST:** Para **crear** un nuevo recurso. Los datos del nuevo recurso se envían en el cuerpo (`req.body`). No es *idempotente*.
  * **PUT:** Para **actualizar** completamente o **reemplazar** un recurso específico. Es *idempotente*.
  * **DELETE:** Para **eliminar** un recurso específico. Es *idempotente*.

### 2\. ¿Cómo debe estructurarse un endpoint según la operación?

Un *endpoint* RESTful debe usar **sustantivos en plural** para representar la colección, y los **verbos HTTP** para indicar la acción:

| Operación | Estructura de Endpoint | Ejemplo |
| :--- | :--- | :--- |
| **Crear** | `POST /coleccion` | `POST /productos` |
| **Leer todos** | `GET /coleccion` | `GET /productos` |
| **Leer uno** | `GET /coleccion/{id}` | `GET /productos/a1` |
| **Actualizar** | `PUT /coleccion/{id}` | `PUT /productos/a1` |
| **Eliminar** | `DELETE /coleccion/{id}` | `DELETE /productos/a1` |

### 3\. ¿Cuál fue el mayor reto en la creación de este servidor?

El mayor reto no fue la sintaxis de las rutas, sino **asegurar la lógica de los códigos de respuesta HTTP**. Fue crucial entender cuándo usar `200 OK` vs. `201 Created`, y cómo estructurar las validaciones para que la API respondiera con el **`400 Bad Request`** (error del cliente) en lugar de un `500 Internal Server Error` (error del servidor) ante datos incorrectos o faltantes.
