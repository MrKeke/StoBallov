const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors')
const {PrismaClient} = require('@prisma/client');
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient()



const app = express();
const port = 3001;
app.use(express.json())
app.use(cors())



app.get('/', async (req, res) => {
    const users = await prisma.user.findMany({})
    res.json({
        users
    })
})
app.post('/register', async (req, res) => {
    try {
        const {email, password,firstName,lastName} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
        if(email === 'alexgraf0701@gmail.com'){
             user = await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    isAdmin: true,
                    firstName,
                    lastName,
                }
            })
        }else{
             user = await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                }
            })
        }

        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.json({
            token
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
        console.log(e.message)
    }

})
app.get('/session', async (req, res) => {
    const {token} = req.headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {password, ...user} = await prisma.user.findUnique({
        where: {
            id: decoded.id
        }
    })
    res.json({
        user
    })
})
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
           res.status(401).json({
               error: 'Пользователя с таким email не существует'
           })
            return
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                error: 'Неверный пароль'
            })
            return
        }
        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.json({
            token
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
})



app.listen(port, async () => {
    await prisma.$connect();
    console.log(`Server is running on port ${port}`);
});
