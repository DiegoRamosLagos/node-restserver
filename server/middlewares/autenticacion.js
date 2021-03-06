const jwt = require('jsonwebtoken');

//==================
// VERIFICAR TOKEN
//==================
let verificaToken = (req, res, next/*continuar la ejecución del programa*/) => {
    // headers de la ruta
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) =>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario; // payload
        next();
    });
}

//==================
// VERIFICAR ADMIN_ROLE
//==================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    
}

//==================
// VERIFICAR TOKEN_IMG
//==================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) =>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario; // payload
        next();
    });
}

module.exports= {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}