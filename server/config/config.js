//==================================
//  PUERTO
//==================================
process.env.PORT = process.env.PORT || 3000;

//==================================
//  ENTORNO
//==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================================
//  Vencimiento del token
//==================================
// 60 seg * 60 min * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==================================
//  clave secreta
//==================================
process.env.SEED = process.env.SEED || 'secreto-de-desarrollo';
//==================================
//  BASE DE DATOS
//==================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else {
    urlDB = process.env.MONGO_URI;
}

process.env.DB = urlDB;

//==================================
//  GOOGLE CLIENT_ID
//==================================
process.env.CLIENT_ID =process.env.CLIENT_ID || '300078044658-oi41mnsai7gfs5uigdma5e306liejsvu.apps.googleusercontent.com'