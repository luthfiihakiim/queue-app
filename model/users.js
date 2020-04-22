const db = require('../config/dbconfig.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createUser = async (payload) => {
    if (await this.checkEmail(payload)) {
        return('Email already taken, User not Signed in')
    }

    lowerCaseEmail = String(payload.email_pengguna).toLowerCase()

    const detail  = [
        payload.nama_pengguna,
        lowerCaseEmail,
        bcrypt.hashSync(payload.password_pengguna, 10),
        payload.tempat_lahir,
        payload.tanggal_lahir,
        payload.informasi_pengguna,
        payload.alamat_pengguna
    ];

    return new Promise((resolve, reject) => {
        (db.one('INSERT INTO pengguna(nama_pengguna, email_pengguna, password_pengguna, tempat_lahir, tanggal_lahir, informasi_pengguna, alamat_pengguna)' + 'VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', detail))
        .then(data => {
            resolve(data)
        })
        .catch(e => {
            reject(e)
        })
    }) 
}

exports.checkEmail = async (payload) => {
    lowerCaseEmail = String(payload.email_pengguna).toLowerCase()
    return (db.oneOrNone('SELECT email_pengguna FROM pengguna WHERE email_pengguna = $1', lowerCaseEmail))
    .then(data => {
        console.log(data)
        if (!data) {
            return (false)
        }
        return (true)
    })
}

exports.checkPass = (payload) => {
    return (db.oneOrNone('SELECT password_pengguna FROM pengguna WHERE email_pengguna = $1', payload.email_pengguna)
    .then(data => {
        const checkLogin = bcrypt.compareSync(payload.password_pengguna, data.password_pengguna)
        if (checkLogin) {
            return(true)
        }
        return(false)
    })
    .catch(e => {
        return (e)
    })
    )
}

exports.checkLogin = (payload) => {
    return new Promise((resolve, reject) => {
        db.one('SELECT password_pengguna FROM pengguna WHERE email_pengguna = $1', payload.email_pengguna)
        .then(data => {
            console.log(data)
            const checkLogin = bcrypt.compareSync(payload.password_pengguna, data.password_pengguna)
            console.log('3')
            console.log(checkLogin)
            if (checkLogin) {
                resolve(true)
            }
            resolve(false)
        })
        .catch((e) => {
            reject(e)
        })
    })
}

exports.authToken = async (payload, user_id) => {
    const info = {
        id: user_id,
        email: payload.email_pengguna,
        pass: payload.password_pengguna,
    }

    const token = jwt.sign(info, process.env.SECRET, {
        algorithm: 'HS256'
    })

    
    if (!token) {
        return({
            status: '200 OK',
            message: 'User Failed to Sign in'
        })    
    }
    
    return({
        status: '200 OK',
        message: 'User Signed In',
        token: token
    })
}

exports.getQueueHistory = (id) => {
    return new Promise((resolve, reject) => {

    })
}

exports.getUserInfo = (id) => {
    return new Promise((resolve, reject) => {
        db.one('SELECT informasi_pengguna FROM pengguna WHERE id_pengguna = $1', id)
        .then(data => {
            resolve(data)
        })
        .catch(e => {
            reject(e)
        })
    })
}

exports.getUserID = (email) => {
    return new Promise((resolve, reject) => {
        db.one('SELECT id_pengguna FROM pengguna WHERE email_pengguna = $1', email)
        .then(data => {
            resolve(data.id_pengguna)
        })
        .catch(e => {
            reject(e)
        })
    })
}