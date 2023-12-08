const header = document.querySelector('header') // ищем верхнее окно "хедер" в документе
const navLinks = document.querySelector("#nav-links") // ищем кнопку навигации в документе
const modal = document.getElementById("feedBackModal"); // ищем всплывающее окно в документе
const span = document.getElementsByClassName("close")[0]; // ищем кнопку закрытия вспл окна в документе
const feedBackTitle = document.getElementById("feedbackTitle"); // ищем заголовок тикета в форме
const feedBackDescription = document.getElementById("feedbackDescription") // ищем тело тикета в форме
const authDiv = document.querySelector('#auth') // ищем в документе кнопку авторизации
const cabinet = document.querySelector('#cabinet') // ищем в документе кнопку перехода в личный кабинет


window.onload = async function () {  // проверяем зашел ли пользователь на стринцу или гость
    const token = window.localStorage.getItem("token"); // получаем токен из хранилища страницы
    if (token) { // если зашел пользователь
        try { // пробуем для отлова ошибки
            const data = await fetch('http://localhost:3001/session', { // отправляем запрос на проверку токена
                method: 'GET', // метод запроса на получение
                headers: { // данные которые прилагаем к запросу
                    'Content-Type': 'application/json', // тип данных которые я передаю
                    'token': token, // передаем токен на сервер
                }
            }).then(response => response.json()); // расшифровываем полученное
            window.localStorage.setItem("user", JSON.stringify(data)); // загружем в хранилище страницы токен для испольования
            const user = JSON.parse(window.localStorage.getItem("user"))
            const fullName = `${user.user.firstName.slice(0, 1)}${user.user.lastName.slice(0, 1)}` // выводим в кнопку личного кабинета первую букву имени и фамилии
            authDiv.style.display = 'none'; // прячем кнопку авторизации
            cabinet.style.display = 'block'; // показываем кнопку входа в личный кабинет
            cabinet.textContent = fullName; // устанавливаем текст кнопки личного кабинета имя и фамлию

        } catch (error) { // получаем ошибку если она есть
            window.localStorage.removeItem("token"); // удаляем из хранилища сайта токен
            window.localStorage.removeItem("user"); // удаляем из хранилища сайта данные о пользователе
        }
    } else {
        // если пользователь не найден на всякий случай делаем действия ниже
        window.localStorage.removeItem("token"); // удаляем из хранилища сайта токен
        window.localStorage.removeItem("user"); // удаляем из хранилища сайта данные о пользователе
    }
}

function logout() { // функция выхода пользователя
    window.localStorage.removeItem("token") // удаляем из хранилища сайта токен и данные о пользователе
    window.localStorage.removeItem("user")
    window.href = '/' // отправляем его на главную страницу
}

window.addEventListener('scroll', function () { // прячем верхную часть страницы если пользователь листает вниз
    const scrolled = window.scrollY; // положение пользователя на странице

    if (scrolled > 20) { // если пользователь ниже 20 пикселей
        header.classList.add('out'); // прячем часть страницы
        navLinks.classList.add("displayNone"); // прячем открытый личный кабинет

    } else { // если меньше
        header.classList.remove('out'); // показываем верхнюю часть страницы

    }
});
document.querySelector("#cabinet").addEventListener("click", () => { // при клике кнопки личного кабинета показываем меню
    navLinks.classList.toggle("displayNone"); // показываем меню
});
// Выход
document.querySelector("#logout").addEventListener("click", () => { // при клике выход пользователя
    logout() // выход пользователя
})

document.querySelector('#feedBack').addEventListener('click', () => { // при клике открываем окно тикета на обратную связь
    modal.style.display = "block"; // показываем скрытое окно
    span.onclick = function () { // при клике на кнопку закрытия добавляем скрытие окна
        modal.style.display = "none"; // скрытие окна
    }
    window.onclick = function (event) { // по клику на задний фон прячем окно
        if (event.target === modal) { // проверка на клик
            modal.style.display = "none"; // скрытие окна
        }
    }
})
document.querySelector('#feedbackSend').addEventListener('click', (e) => { // при клике на кнопку отправить тикет
    e.preventDefault(); // отключаем перезагрузку страницы по нажатию
    const title = feedBackTitle.value // обозначаем значение заголовка в форме
    const description = feedBackDescription.value // обозачаем значение основной части в форме
    fetch('http://localhost:3001/feedback', { // запрос на сервер о создании фидбека
        method: 'POST', // метод отправки создание
        headers: {'Content-Type': 'application/json', token: token ? token : ''}, // тип данных которые мы отправляем и токен
        body: JSON.stringify({
            title, description // отправляем заголовок и тело тикета
        })
    })
    span.click() // закрываем ранее скрытое окно
})

