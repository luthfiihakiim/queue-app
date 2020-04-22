const db = require('../config/dbconfig.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createOrganization = async (payload) => {
    if (await this.checkEmail(payload)) {
        return('Email already taken, User not Signed in')
    }
    
    lowerCaseEmail = String(payload.email_instansi).toLowerCase()

    const detail = [
        payload.nama_instansi,
        payload.alamat_instansi,
        payload.jenis_instansi,
        lowerCaseEmail,
        bcrypt.hashSync(payload.password_instansi, 10),
        payload.informasi_instansi
    ];
    return new Promise((resolve, reject) => {
        db.one('INSERT INTO instansi(nama_instansi, alamat_instansi, jenis_instansi, email_instansi, password_instansi, informasi_instansi)' + 'VALUES($1, $2, $3, $4, $5, $6) RETURNING *', detail)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.getOrganizationInfo = (id) => {
    return new Promise((resolve, reject) => {
        db.one('SELECT informasi_instansi FROM instansi WHERE id_instansi = $1', id)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.checkEmail = async (payload) => {
    lowerCaseEmail = String(payload.email_instansi).toLowerCase()
    return (db.oneOrNone('SELECT email_instansi FROM instansi WHERE email_instansi = $1', lowerCaseEmail))
    .then(data => {
        console.log(data)
        if (!data) {
            return (false)
        }
        return (true)
    })
}

exports.checkPass = (payload) => {
    return (db.oneOrNone('SELECT password_instansi FROM instansi WHERE email_instansi = $1', payload.email_instansi)
    .then(data => {
        const checkLogin = bcrypt.compareSync(payload.password_instansi, data.password_instansi)
        if (checkLogin) {
            return(true)
        }
        return(false)
    }))
}

exports.getOrgID = (email) => {
    return new Promise((resolve, reject) => {
        db.one('SELECT id_instansi FROM instansi WHERE email_instansi = $1', email)
        .then(data => {
            resolve(data.id_instansi)
        })
        .catch(e => {
            reject(e)
        })
    })
}

exports.authToken = async (payload, org_id) => {
    const info = {
        id: org_id,
        email: payload.email_instansi,
        password: payload.password_instansi
    }

    const token = jwt.sign(info, process.env.SECRET, {
        algorithm: 'HS256'
    })

    if (!token) {
        return ({
            status: '200 OK',
            message: 'User failed to sign in'
        })
    }

    return ({
        status: '200 OK',
        message: 'Organization Signed In',
        token: token
    })
}

exports.createService = (payload) => {
    return new Promise((resolve, reject) => {
        const detail = [
            payload.nama_layanan,
            payload.operator_layanan,
            payload.informasi_layanan,
            payload.id_instansi
        ];
        db.one('INSERT INTO layanan(nama_layanan, operator_layanan, informasi_layaan, id_instansi) + VALUES($1, $2, $3, $4) RETURNING *', detail)
        .then(data => {
            resolve(data)
        })
        .catch(e => {
            reject(e)
        })
    })
}

exports.showService = (id) => {
    return new Promise((resolve, reject) => {
        db.many('SELECT nama_layanan FROM layanan WHERE id_perusahaan = $1', id)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}

exports.showServiceInfo = (id_org, id_service) => {
    return new Promise((resolve, reject) => {
        db.many('SELECT informasi_layanan FROM layanan WHERE id_perusahaan = $1 AND id_layanan = $2', id_org, id_service)
        .then(data => {
            resolve(data);
        })
        .catch(e => {
            reject(e);
        })
    })
}