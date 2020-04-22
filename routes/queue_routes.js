const express = require('express');
const router = express.Router();
const session = require('express-session');
const queue = require('../model/queue');
var auth = require('../model/auth')

const results400 = {
  status: 400,
  message: 'Data not completed'
}

router.get("/:id", async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).send(results400)
      }
      const constQueue = await queue.getQueue(req.params.id);
      const results = {
        status: '200 OK',
        message: 'Request Success',
        data: constQueue
      }
      res.send(results)
    }
    catch(e) {
      console.log(e)
      res.status(500).json(e)
    }
});

router.post("/:id", auth.isAuth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send(results400)
    }
    const lastQueue = await queue.getLastQueueInfo(req.params.id);
    lastQueue[0].nomor_antrian = lastQueue[0].nomor_antrian + 1;
    lastQueue[0].id_pengguna = req.user.id;

    const tambahQueue = await queue.addQueue(lastQueue);

    const results = {
      status: '200 OK',
      message: 'Request Success',
      data: tambahQueue
    }
    res.send(results)
  }
  catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
});

router.get("/getInfo/:id", auth.isAuth, async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).send(results400)
      }
      const infoQueue = await queue.getCurrentQueueInfo(req.params.id);
      const results = {
        status: '200 OK',
        message: 'Request Success',
        data: infoQueue
      }
      res.send(results)
    }
    catch(e) {
      console.log(e)
      res.status(500).json(e)
    }
});
  
router.put("/deleteByUser/:id_l", auth.isAuth, async (req, res) => {
  try {
    if (!req.params.id_l) {
      return res.status(400).send(results400)
    }
    const delQueueByUser = await queue.deleteQueueByUser(req.user.id, req.params.id_l)
    const results = {
      status: '200 OK',
      message: 'Queue Deleted',
      data: delQueueByUser
    }
    res.send(results)
  }
  catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
});

router.put("/deleteByOrg/:id_p/:id_l", auth.isAuth, async (req, res) => {
  try {
    if (!req.params.id_p || !req.params.id_l) {
      return res.status(400).send(results400)
    }
    const delQueueByOrg = await queue.deleteQueueByUser(req.params.id_p, req.params.id_l)
    const results = {
      status: '200 OK',
      message: 'Queue Deleted',
      data: delQueueByOrg
    }
    res.send(results)
  }
  catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
});

module.exports = router;