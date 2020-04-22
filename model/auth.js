const jwt = require('jsonwebtoken')

exports.isAuth = (req, res, next) => {
    try {
        const token = req.headers.token;
        var decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded
        next()
    } catch(err) {
        res.status(401).json({
            message: 'Token is Invalid'
        })
    }
}

/*
LIST JWT TOKEN:
- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODcwMjIyMDJ9.PXwsD4JuAktvaVjKgip9QsRo01W5NRte9C2ONVd3Xnk

- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODcwMjUzMjl9.VKVkrUULA301XTyRSw2IBUjTk3bf79kw9tT7y7eRQvE

- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODcwMjU1NzZ9.s0f-cvbHUHutYjXKPxq2HW3jkoL6_aeB-_K7iB9vRKE

-ORG

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiIxOUFwcmlsMjAyMEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjE5QXByaWwyMDIwIiwiaWF0IjoxNTg3MzE2MDI4fQ.mqRNU4w2GZyZ2uFCqbUlGq-jm3RS-TEH0OCsikz8ckc
*/