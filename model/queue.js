const db = require('../config/dbconfig.js');

exports.getQueue = (id_layanan) => {
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM antrian WHERE id_layanan = $1 ORDER BY nomor_antrian ASC', id_layanan)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.addQueue = (payload) => {
    return new Promise((resolve, reject) => {
        const info = [
            payload[0].id_layanan,
            payload[0].id_pengguna,
            payload[0].id_instansi,
            payload[0].nomor_antrian

        ]

        db.one('INSERT into antrian (id_layanan, id_pengguna, id_instansi, nomor_antrian)' + 'VALUES ($1, $2, $3, $4) RETURNING *', info)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.deleteQueueByUser = (id_pengguna, id_layanan) => {
    return new Promise((resolve, reject) => {
        db.any('DELETE FROM antrian WHERE id_pengguna = $1 AND id_layanan = $2', [id_pengguna, id_layanan])
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.deleteQueueByOrg = (id_pengguna, id_layanan) => {
    return new Promise((resolve, reject) => {
        db.any('DELETE FROM antrian WHERE id_pengguna = $1 AND id_layanan = $2', [id_pengguna, id_layanan])
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}
exports.getCurrentQueueInfo = (id_layanan) => {
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM antrian WHERE id_layanan = $1 ORDER BY nomor_antrian ASC LIMIT 1', id_layanan)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.getLastQueueInfo = (id_layanan) => {
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM antrian WHERE id_layanan = $1 ORDER BY nomor_antrian DESC LIMIT 1', id_layanan)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}