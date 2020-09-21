const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//===============================================
//              Obtener Productos
//===============================================
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // Populate: Usuario, Categoria
    // Paginado
    let desde = req.query.desde || 0;
    desde = Number(desde) // transforma string a numero
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni descripcion img categoria usuario')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad: conteo
                });
            });
        });
});

//===============================================
//              Obtener Producto por id
//===============================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // Populate: Usuario, Categoria
    // Paginado
    let id = req.params.id

    Producto.findById(id).populate('usuario', 'nombre email').populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

//===============================================
//              Buscar Producto
//===============================================
app.get('/productos/buscar/:termino', verificaToken, (req, res)=> {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');
    Producto.find({nombre: regexp}).populate('categoria', 'descripcion')
    .exec((err, productos) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        })
    });
});

//===============================================
//              Crear Producto
//===============================================
app.post('/productos', verificaToken, (req, res) => {
    // Grabar usuario
    // Grabar categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        img: body.img,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//===============================================
//              Actualizar Producto
//===============================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // Grabar usuario
    // Grabar categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.img = body.img;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;


        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        });
    });
});

//===============================================
//              Borrar Producto
//===============================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // Borrado lógico
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});

module.exports = app;