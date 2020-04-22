const express = require('express')
const router = express.Router()
const organization = require('../model/organization')
var auth = require('../model/auth')

const results400 = {
    status: 400,
    message: 'Data not completed'
}

router.post("/create", async (req, res) => {
    try {
        if (!req.body.nama_instansi || !req.body.alamat_instansi || !req.body.jenis_instansi || !req.body.email_instansi || !req.body.password_instansi || !req.body.informasi_instansi) {
            return res.status(400).send(results400)
        }
        const orgData = await organization.createOrganization(req.body)
        results = {
            status: '201 OK',
            message: "Organization Created",
            data: orgData
        }
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.post("/loginAuth", async (req, res) => {
    try {
        if (!req.body.email_instansi || !req.body.password_instansi) {
            return res.status(400).send(results400)
        }

        const checkEmail =  await organization.checkEmail(req.body)
        const checkPass = await organization.checkPass(req.body)
        if (!checkEmail || !checkPass) {
            results = {
                status: '500 Internal Server Error',
                message: 'Failed to Sign In, Email or Password not found',
                data: ({
                    email: req.body.email_instansi, 
                    password: req.body.password_instansi
                }),
            }
            return (res.status(200).send(results))
        }

        //dua fungsi dibawah gamungkin error kecuali DB
        const org_id = await organization.getOrgID(req.body.email_instansi)
        const token = await organization.authToken(req.body, org_id)
        res.status(200).send(token)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }   
})

router.get("/getInfo/:id", auth.isAuth, async (req, res) => {
    try {
        if (!req.params.id) {
            return (res.status(400).send(results400))
        }
        const orgInfo = await organization.getOrganizationInfo(req.params.id)
        const results = {
            status: '200 OK',
            message: 'Request Success',
            data: orgInfo
        }
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
});

router.get("/createService", async (req, res) => {
    try {
        if (!req.body.nama_layanan || !req.body.operator_layanan || !req.body.informasi_layanan || !req.body.id_instansi) {
            return res.status(400).send(results400)
        }
        const serviceData = await organization.createService(req.body)
        const results = {
            status: '201 Service Created',
            message: 'Service Created',
            data: serviceData
        } 
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.get("/showService/:id", async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send(results400)
        }
        const showService = organization.showService(id)
        const results = {
            status: '200 OK',
            message: 'Request Success',
            data: showService
        }
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.get("/showServiceInfo/:id_org/:id_svc", async (req, res) => {
    try {
        if (!req.params.id_org || !req.params.id_svc) {
            return res.status(400).send(results400)
        }
        const serviceInfo = await organization.showServiceInfo(id_org, id_svc)
        results = {
            status: '200 OK',
            message: 'Request Success',
            data: serviceInfo
        }
        res.send(results)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

//ONLY REDIRECT

router.get('/logout', async (req, res) => {
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