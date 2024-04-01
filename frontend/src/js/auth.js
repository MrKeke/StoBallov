const buttonReg = document.querySelector('#register-button'); // кнопка отправки регистрации
const emailInputReg = document.querySelector('#email-register'); // форма с почтой регистрации
const passwordInputReg = document.querySelector('#password-register'); // форма с паролем регистрации
const passwordConfirmInputReg = document.querySelector('#password-confirm-register'); // форма с повтором пароля регистрации
const firstNameInputReg = document.querySelector('#first-name-register'); // форма с именем регистрации
const lastNameInputReg = document.querySelector('#last-name-register'); // формас фамилией регистрации
const errorReg = document.querySelector('#error-register'); // поле с ошибкой регистрации
const radioButtonReg9 = document.querySelector('#nine') // поле с выбором 9го класса
const radioButtonReg11 = document.querySelector('#eleven') // поле с выбором 11го класса

const buttonLogin = document.querySelector('#button-login'); // кнопки отправки логина
const emailInputLogin = document.querySelector('#email-login'); // форма с почтой в логине
const passwordInputLogin = document.querySelector('#password-login'); // форма с паролем в логине
const errorLogin = document.querySelector('#error-login'); // поле с ошибкой в логине

window.onload = () => { // проверка гость ли пользователь
    if (window.localStorage.getItem('token') !== null) { // если пользователь не гость отправляем на главную страницу
        window.location.href = '/';
    }
}

function showError(elementArray, errorDiv, errorMessage) { // функцию показа ошибок
    elementArray.forEach(element => { // во всех переданных полях показываем ошибку
        element.style.border = '1px solid red'; // подцветка красным полей
        element.style.borderRadius = '5px'; // ширина полей
    });
    errorDiv.innerHTML = errorMessage; // текст ошибки в поле с ошибкой
    errorDiv.style.display = 'block'; // показывает поле с ошибкой пользователю
}

async function register(email, password, firstName, lastName, grade) { // функция на запрос регистрации
    const response = await fetch(`${server}register`, { // запрос на сервер с регистрацие пользователя
        method: 'POST', // метод отправка
        headers: {
            'Content-Type': 'application/json' // тип передаваемых данных
        },
        body: JSON.stringify({
            email: email, // передаем почту
            password: password, // пароль
            firstName: firstName,// имя
            lastName: lastName,// фамилию
            grade: grade // год обучения
        })
    })
    const data = await response.json(); // дожидаемся ответа
    if (response.status === 200) { // если ошибок нет то
        window.localStorage.setItem("token", data.token); // сохраняем в хранилище сайта токен
        window.location.href = '/'; // отправляем пользователя на главную страницу
    } else if (response.status === 401) { // если ошибка
        showError([emailInputReg, passwordInputReg, passwordConfirmInputReg], errorReg, 'Пользователь с таким email уже зарегистрирован'); // передаем поля где нужно вывести ошибку и текст ошибки для их вывода
    }

}

async function login(email, password) { // функция запроса на логин
    const response = await fetch(`${server}login`, { // запрос логина на сервер
        method: 'POST', // метод отправка
        headers: {
            'Content-Type': 'application/json' // тип отправляемых данных
        },
        body: JSON.stringify({
            email: email, // отправляем почту
            password: password // пароль
        })
    });
    const data = await response.json(); // дожидаемся ответа
    if (response.status === 200) { // если все хорошо то
        window.localStorage.setItem("token", data.token); // добавляем в хранилище сайта токен
        window.location.href = '/'; // отправляем пользователя на главную страницу
    } else if (response.status === 401) { // если ошибка то
        showError([emailInputLogin, passwordInputLogin], errorLogin, 'Пользователь не найден'); // отображаем ошибку и ее текст в выбранных полях
    }
    return  true
}

// register
buttonReg.addEventListener('click', (e) => { // при клике на кнопку регистрации проводим регистраци/
    [emailInputReg, passwordInputReg, passwordConfirmInputReg].forEach(element => { // убираем ошибки если он есть
        element.style.border = '1px solid black'; // ставим нормальные поля всем формам
    })
    e.preventDefault(); // убираем перезагрузку при клике
    const email = emailInputReg.value.trim(); // берем значение из формы с почтой
    const password = passwordInputReg.value.trim(); // берем значение из формы с паролем
    const passwordConfirm = passwordConfirmInputReg.value.trim(); // берем значение из формы с подтверждением пароля
    const firstName = firstNameInputReg.value.trim(); // берем значение из формы с именем
    const lastName = lastNameInputReg.value.trim(); // берем значение из формы с фамилией
    const radio11 = radioButtonReg11.checked // проверяем выбран ли 11 класс
    const radio9 = radioButtonReg9.checked // проверяем выбран ли 9 класс
    if (email === '' || password === '' || passwordConfirm === '' || firstName === '' || lastName === '') { // если какое-то из полей пустое выводим ошибку
        showError([emailInputReg, passwordInputReg, passwordConfirmInputReg, firstNameInputReg, lastNameInputReg], errorReg, 'Заполните все поля')
    } else if (email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/) === null) { // если почта не формата почты выводим ошибку
        showError([emailInputReg], errorReg, 'Введите корректный email')
    } else if (password !== passwordConfirm) { // если пароли не сопадают выводим ошибку
        showError([passwordInputReg, passwordConfirmInputReg], errorReg, 'Пароли не совпадают');
    } else if (password.length < 6) { // если пароль меньше 6 символов выводим ошибку
        showError([passwordInputReg, passwordConfirmInputReg], errorReg, 'Пароль должен быть не менее 6 символов');
    } else if (!radio9 && !radio11) { // если не выбран класс выводим ошибку
        showError([radioButtonReg9, radioButtonReg11], errorReg, 'Выберите год обучения')
    } else { // если все хорошо выполняем регистрацию
        radio9 && register(email, password, firstName, lastName, 9) // ргистрация 9го класса
        radio11 && register(email, password, firstName, lastName, 11) // регистрация 11 класса
    }
})

buttonLogin.addEventListener('click', (e) => { // клик по кнопке логина
    e.preventDefault(); // отмена перезагрузки страницы
    [emailInputLogin, passwordInputLogin].forEach(element => { // очищаем ошибки если они есть
        element.style.border = '1px solid black'; // ставим нормальную обводку форме
    })
    const email = emailInputLogin.value.trim(); // берем значение из формы с почтой
    const password = passwordInputLogin.value.trim(); // берем значение из формы с пароем
    if (email === '' || password === '') { // проверка на заполненность всех полей и вывод ошибки
        showError([emailInputLogin, passwordInputLogin], errorLogin, 'Заполните все поля')
    } else if (email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/) === null) { // проверка почты на корректность и вывод ошибки
        showError([emailInputLogin], errorLogin, 'Введите корректный email')
    } else { // логин
        login(email, password) // логин пользователя на сервре
    }
})
