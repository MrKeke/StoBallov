const express = require('express'); // приложение нужное для работы базы данных
const bcrypt = require('bcrypt'); // шифратор паролей чтобы они не хранились так
const cors = require('cors'); // политика не позволяющая всем подключаться к базе
const {PrismaClient} = require('@prisma/client'); // подключение структуры базы данных
const jwt = require('jsonwebtoken'); // токен для подтверждения наличия в базе
const prisma = new PrismaClient();  // визуализация базы в файле

const app = express(); // обозначение приложения для работы базы данных
const port = 3001; // порт на котором будет работать база

app.use(express.json()) // обозначение вида базы данных
app.use(cors()) // устанавливаем политику для базы данных


app.get('/', async (req, res) => { // устанавливаем страницу для просмотра всей базы данных
    const users = await prisma.user.findMany({}) // получаем с базы всех пользователей
    const lessons = await prisma.lesson.findMany({}) // получаем все уроки с базы
    const comments = await prisma.comments.findMany({}) // получаем все комментарии
    const feedback = await prisma.feedBackTicket.findMany({}) // получаем все тикеты с базы
    res.json({ // отображаем их
        users, lessons, comments, feedback,
    })
})
app.post('/register', async (req, res) => { // устанавливаем страницу регистрация пользователя
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const {email, password, firstName, lastName, grade} = req.body; // получаем  почту пароль имея и класс пользователя
        const hashedPassword = await bcrypt.hash(password, 10); // шифруем пароль
        const user = await prisma.user.create({ // создаем в базе нового пользователя
            data: {
                email: email, // задаем почту
                password: hashedPassword, // задаем пароль
                isAdmin: email === 'yelizaveta.kozinenko@gmail.com', // проверяем регистрируется ли админ и отдаем базе данных
                firstName, // задаем имя
                lastName, // задаем фамлию
                grade, // задаем класс обучения
            }
        })
        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'}) // создаем токен для пользователя

        res.status(200).json({ // возвращаем токен
            token
        })
    } catch (e) { // ловим ошибку
        res.status(401).json({ // возвращаем ошибку
            error: e.message
        })
    }

})
app.post('/login', async (req, res) => { // логин пользователя
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const {email, password} = req.body; // получаем почту и пароль
        const user = await prisma.user.findUnique({ // ищем в базе по почте пользователя
            where: { // поиск
                email: email // по почте
            }
        })
        const token = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'}) // создаем токе для пользователя

        if (!user) { // если выше пользователь не найден то возвращаем ошибку
            res.status(401).json({
                error: 'Пользователя с таким email не существует' // ошибка
            })
            return
        }
        const isMatch = await bcrypt.compare(password, user.password); // шифруем и проверям совпадает ли шифр
        if (!isMatch) { // если пароль не сопадаетает возвращаем ошибку
            res.status(401).json({
                error: 'Неверный пароль'
            })
            return
        }
        res.json({
            token // если все хорошо возвращаем токен
        })
    } catch (e) { // ловим ошибку и возвращаем ее
        res.status(401).json({
            error: e.message // ошибка
        })
    }
})
app.get('/session', async (req, res) => { // запрос на проверку токена и сесси
    try {  // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const {token} = req.headers // получаем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // получаем из токена пользователя
        const {password, ...user} = await prisma.user.findUnique({ // ищем по айди пользователя
            where: {
                id: decoded.id
            }
        })
        res.status(200).json({
            user // возвращаем пользователя
        })
    } catch (e) { // если ошибка ловим ее и возвращаем
        res.status(401).json({
            error: e.message // ошибка
        })
    }
})
app.post('/feedback', async (req, res) => { // создаем тике на фидбек
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const {title, description} = req.body // получаем заголовок и тело тикета
        const token = req.headers.token // получаем токен
        const {id} = jwt.verify(token, process.env.JWT_SECRET) // преобразуем его в id пользователя
        await prisma.feedBackTicket.create({ // создаем тикет в бд
            data: {
                title, // передаем заголовк
                description, // передаем тело
                authorId: id, // указываем айди создателя из токена
            }

        })
        res.status(200) // возвращаем информацию что все хорошо
    } catch (e) { // возвращаем ошибку если где-то пошло все не так
        res.status(401).json({
            error: e.message // ошибка
        })
    }
})
app.post('/lesson', async (req, res) => { // запрос на создание в базе урока
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const token = req.headers.token // получаем токен
        const {title, description, youtubeLink, homework, dateStart,grade} = req.body // получаем данные для создания урока
        const {id} = jwt.verify(token, process.env.JWT_SECRET) // из токена берем id
        console.log('id:', id)
        await prisma.lesson.create({ // создаем урок в бд
            data: {
                title, // передаем заголовок
                description, // тело урока
                youtubeLink, // ссылка на урок на ютуб
                homework, // домашнее задание
                dateStart, // дата на которой записан урок
                forGrade: grade, // для 9 или 11 класса урок
                completedUsers: { connect: { id: id } }
            }
        })
        res.status(200) // возвращаем что все хорошо
    } catch (e) { // ловим ошбику
        console.log(e)
        res.status(401).json({
            error: e.message // возвращаем ошиюку
        })
    }
})
app.get('/lessons', async (req, res) => { // запрос на получение всех уроков из бд
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const lessons = await prisma.lesson.findMany({}) // получаем из базы все кроки
        res.status(200).json({lessons: lessons}) // возвращаем уроки
    } catch (e) { // ловим ошибку
        res.status(401).json({
            error: e.message // возвращаем ошибку
        })
    }
})
app.delete('/lesson/:id', async (req, res) => { // запрос на удаление урока
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const lessonID = req.params.id; // получаем айди урока
        await prisma.lesson.delete({ // удаляем из базы урок
            where: {id: Number(lessonID)} // поиск и удаление
        })
        res.status(200) // возвращаем что все хорошо
    } catch (e) { // ловим ошибку
        res.status(401) // возвращаем ошибку
    }
})
app.post('/comment', async (req, res) => { // запрос на создание комментария
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const token = req.headers.token;
        const {description, lessonId} = req.body;
        console.log(req.body);
        const user = jwt.verify(token, process.env.JWT_SECRET);

        await prisma.comments.create({
            data: {
                description: description, creater: {
                    connect: {id: user.id}
                }, lesson: {
                    connect: {id: parseInt(lessonId)}
                },
            },
        });
        res.status(200) // возвращаем что все хорошо

    } catch (e) { // ловим ошибку
        res.status(401) // возращаем ошиюку
        console.log(e)
    }
})
app.get('/comment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const comments = await prisma.comments.findMany({
            where: {
                lessonId: Number(id)
            }, include: {
                creater: {
                    select: {
                        firstName: true, lastName: true
                    }
                }
            }
        });

        const formattedComments = comments.map(comment => [`${comment.creater.firstName} ${comment.creater.lastName}`, comment.description]);

        res.status(200).json({
            lessons: formattedComments
        });
    } catch (e) {
        res.status(401).json({
            errors: e.message
        });
    }
});

app.delete('/comment/:id', async (req, res) => { // запрос на удаление комментария
    try { // пробуем сделать то что ниже чтобы в случае ошибки ничего не сломать
        const commentID = req.params.id; // получаем айди комментария
        await prisma.comments.delete({ // удаление комменатрия
            where: {id: Number(commentID)}// поиск и удаление
        })
        res.status(200) // возращаем успех
    } catch (e) { // ловим ошибку
        res.status(401) // возвращаем ошибку
    }
})

app.listen(port, async () => { // база работает на порту указанным ниже
    await prisma.$connect(); // подключение к базе
    console.log(`Server is running on port ${port}`); // сообщение об успешной начале работы
});
