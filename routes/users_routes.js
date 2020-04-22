const express = require('express')
const router = express.Router()
const users = require('../model/users')
var auth = require('../model/auth')

const results400 = {
    status: 400,
    message: 'Data not completed or invalid'
}

const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

router.get('/', function(req, res) {
    res.status(200).send("HOME USER")
});

router.post("/create", async (req, res) => {
    try {
        if (!req.body.nama_pengguna || (!regex.test(String(req.body.email_pengguna).toLowerCase())) || !req.body.email_pengguna || !req.body.password_pengguna || !req.body.informasi_pengguna || !req.body.alamat_pengguna || !req.body.tempat_lahir) {
            return res.status(400).send(results400)
        }

        const pengguna = await users.createUser(req.body)
        const results  = {
            data: pengguna
        }
        res.status(201).send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
});
  
router.get("/getInfo/", auth.isAuth , async (req, res) => {
    try {
        if (!req.user.id) {
            return (res.status(400).send(results400))
        }
        
        console.log(req.user)
        //harusnya dibawah udah ga ada error kecuali dari DB
        const userInfo = await users.getUserInfo(req.user.id)
        results = {
            status: '200 OK',
            message: 'Request Success',
            data: userInfo
        }
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
});

router.post('/loginAuth', async (req, res) => {
    try {
        if (!req.body.email_pengguna || !req.body.password_pengguna) {
            return res.status(400).send(results400)
        }

        const email =  await users.checkEmail(req.body)
        const pass = await users.checkPass(req.body)
        if (!email || !pass) {
            results = {
                status: '500 Internal Server Error',
                message: 'Failed to Sign In, Email or Password not found',
                data: ({
                    email: req.body.email_pengguna, 
                    password: req.body.password_pengguna
                }),
            }
            return (res.status(200).send(results))
        }

        //dua fungsi dibawah gamungkin error kecuali DB
        const user_id = await users.getUserID(req.body.email_pengguna)
        const token = await users.authToken(req.body, user_id)
        res.cookie('token', token, {
            secure: false,
            httpOnly: true,
        })
        res.status(200).send(token)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
});

//ONLY REDIRECT
router.get("/login", (req, res) => {
    res.redirect('') //redirect ke halaman login
})

router.post('/logout', auth.isAuth, async (req, res) => {
    try {
        res.clearCookie('token', {
            secure: false,
            httpOnly: true,
        })
        res.redirect(200, '/users/')
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

module.exports = router;