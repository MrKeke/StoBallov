const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const app = express();
const port = 8675;
const fs = require('fs');
var privateKey = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var https = require('https');
var httpsServer = https.createServer(credentials, app);
app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany({})
    const lessons = await prisma.lesson.findMany({})
    const comments = await prisma.comments.findMany({})
    const feedback = await prisma.feedBackTicket.findMany({})
    res.json({
        users,
        lessons,
        comments,
        feedback,
    })
})
app.post('/register', async (req, res) => {
    try {
        const {email, password, firstName, lastName} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                isAdmin: email === 'alexgraf0701@gmail.com',
                firstName,
                lastName,
            }
        })
        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.status(200).json({
            token
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }

})
app.get('/session', async (req, res) => {
    try {
        const {token} = req.headers
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {password, ...user} = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })
        res.status(200).json({
            user
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }

})
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})

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
        res.json({
            token
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
})
app.post('/feedback', async (req, res) => {
    try {
        const {title, description} = req.body
        const token = req.headers.token
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        await prisma.feedBackTicket.create({
            data: {
                title,
                description,
                authorId: id,
            }

        })
        res.status(200)
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
})
app.post('/lesson', async (req, res) => {
    try {
        const token = req.headers.token
        const {title, description, youtubeLink, homework, dateStart} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        console.log(req.body)
        console.log(req.body.dateStart)
        await prisma.lesson.create({
            data: {
                title,
                description,
                youtubeLink,
                homework,
                dateStart,
                completedUsers: {
                    connect: [{id}]
                }
            }
        })
        res.status(200)
    } catch (e) {
        console.log(e.message)
        res.status(401).json({
            error: e.message
        })
    }
})
app.get('/lesson', async (req, res) => {
    try {
        const token = req.headers.token
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        const {completedLessons} = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                completedLessons: true
            }
        })
        res.status(200).json({
            lessons: completedLessons
        })
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
})
app.get('/lessons', async (req, res) => {
    try{
        const lessons = await prisma.lesson.findMany({})
        res.status(200).json({lessons: lessons})
    }catch (e){
        res.status(401).json({
            error: e.message
        })
    }
})
app.delete('/lesson/:id', async (req, res) => {
    try {
        const token = req.headers.token
        const lessonID = req.params.id;

        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        const deleted = await prisma.lesson.delete({
            where: {id: Number(lessonID)}
        })
        res.status(200)
    } catch (e) {
        res.status(401)
    }
})
app.patch('/lesson/:id', async (req, res) => {
    try {
        const token = req.headers.token
        const lessonID = req.params.id;
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        await prisma.lesson.update({
            where: {
                id: Number(lessonID)
            },
            data: {
                completedUsers: {
                    connect: [{id}]
                }
            }
        })
        res.status(200)
    } catch (e) {
        res.status(401)
    }
})
app.post('/comment', async (req, res) => {
    try {
        const token = req.headers.token
        const {description, lessonId} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        const comment = await prisma.comments.create({
            data: {
                description: description,
                lessonId,
                createrId: id,
            }
        })
    } catch (e) {
        res.status(401)
    }
})
app.get('/comment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const comments = await prisma.comments.findMany({
            where: {
                lessonId: Number(id)
            }
        })
        res.status(200).json({
            lessons: comments
        })
    } catch (e) {
        res.status(401).json({
            errors: e.message
        })
    }
})

app.delete('/comment/:id', async (req, res) => {
    try {
        const token = req.headers.token
        const commentID = req.params.id;
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        const deleted = await prisma.comments.delete({
            where: {id: Number(commentID)}
        })
        res.status(200)
    } catch (e) {
        res.status(401)
    }
})

httpsServer.listen(port, async () => {
    await prisma.$connect();
    console.log(`Server is running on port ${port}`);
});
