let isAdmin = JSON.parse(window.localStorage.getItem("user")).user.isAdmin // проверка на администратора
const header = document.querySelector('header') // поиск верхнего окна в документе
const radioButtonReg9 = document.querySelector('#nine') // поиск выбора класса в форме в документе
const token = window.localStorage.getItem('token'); // читаем токен из хранилища сайта
const userGrade = JSON.parse(window.localStorage.getItem("user")).user.grade // читаем пользователя из хранилища сайта
const btnAdminForm = document.getElementById("btn-admin-form"); // ищем в документе кнопку отправки урока админом
const formTitle = document.getElementById("form-title"); // ищем в документе форму заголовка в админ форме
const formDescription = document.getElementById("form-description"); // ищем в документе форму тела в админ форме
const formYoutube = document.getElementById("form-youtube"); // ищем в документе форму ссылки в админ форме
const formHomework = document.getElementById("form-homework"); // ищем в документе форму дз в админ форме
const lessonTitle = document.getElementById("lessonTitle"); // ищем в документе заголовка урока в вспылвающем окне
const lessonDescription = document.getElementById("lessonDescription"); // ищем в документе тело урока в всплыващем окне
const lessonYoutube = document.getElementById("lessonYoutube"); // ищем в документе ссылку на дз урока
const lessonHomework = document.getElementById("lessonHomework"); // ищем в документе дз урока
let openedLesson = -1; // открытый урок
const commentContainer = document.getElementById("commentContainer");
const server = 'https://stoballov.onrender.com/'
window.onload = async function () { // при загрузке проверям не зашел ли случайно гость
    if (token === null) {
        window.href = '/' // если гость отправляем на главную страницу
    }
}
// логика создания календаря начало
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
const monthDecoded = {
    0: 'Январь',
    1: "Февраль",
    2: "Март",
    3: "Апрель",
    4: "Май",
    5: "Июнь",
    6: "Июль",
    7: "Август",
    8: "Сентябрь",
    9: "Октябрь",
    10: "Ноябрь",
    11: "Декабрь",
}

function includeDate(mapped, date) { // функцию отбора из уроков нужного по дате
    const splitDate = date.split('-')

    let currentLesson = mapped.filter((lesson) => { // ищем нужный
        return lesson.dateStart === `${splitDate[0]}-${splitDate[1].length === 1 ? '0'+splitDate[1] : splitDate[1]}-${splitDate[2]}`
    })
    if (currentLesson[0]) { // если он есть то
        const div = document.createElement('div') // создаем новый компонент
        div.textContent = currentLesson[0].title // ставим текстом компонента заголовок
        div.id = currentLesson[0].id // ставим айди для дальнейшей логики
        div.classList.add('titleLesson') // добавляем стиль
        console.log(div)
        return div // возвращаем его для дальнейшей работы

    } else {
        return null // иначе возвращаем ничего
    }


}

async function load() {
    const response = await fetch(`${server}lessons`, { // запрос на получение всех уроков с сервера
        method: 'GET', // метод получения получить
        headers: {
            'Content-Type': 'application/json', // тип данных
            'token': window.localStorage.getItem('token'), // даем токен
        }
    });
    const data = await response.json() // дожидаемся
    const mapped = data.lessons.map((lesson) => {
        const newDate = new Date(lesson.dateStart).toLocaleDateString('en-GB').split('/') // делаем дату в нормальный вид
        newDate[0] = Number(newDate[0])
        lesson.dateStart = newDate.join('-')
        return lesson
    }).filter((lesson) => { // логика показа 9ому класса уроков для 9го класса и 11го
        if (isAdmin) {  // если администратор показывать все
            return true
        } else {
            return lesson.forGrade === userGrade
        }
    })
    document.getElementById('monthYear').textContent = `${monthDecoded[month]} ${year}`;

    let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let daysDiv = document.getElementById('days');
    days.forEach(day => {
        let div = document.createElement('div');
        div.textContent = day;
        daysDiv.appendChild(div);
    });

    let datesDiv = document.getElementById('dates');
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDayOfMonth; i++) {
        let div = document.createElement('div')
        div.classList.add('day');
        div.classList.add('blackDay');
        datesDiv.appendChild(div);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let div = document.createElement('div');
        div.textContent = i;
        div.classList.add('day');
        div.dataset["time"] = `${i}-${month + 1}-${year}`;
        const divTitle = includeDate(mapped, `${i}-${month + 1}-${year}`)
        if (divTitle !== null) {
            div.appendChild(divTitle);
        } else if (isAdmin) {
            const spanAdmin = document.createElement('span');
            spanAdmin.classList.add('addSomething')
            spanAdmin.textContent = '+';
            div.appendChild(spanAdmin);
        }
        datesDiv.appendChild(div);
    }

    document.getElementById('prev').addEventListener('click', () => {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        document.getElementById('monthYear').textContent = `${monthDecoded[month]} ${year}`;
        datesDiv.innerHTML = '';
        firstDayOfMonth = new Date(year, month, 1).getDay();
        daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i < firstDayOfMonth; i++) {
            let div = document.createElement('div');
            div.classList.add('day');
            div.classList.add('blackDay');
            datesDiv.appendChild(div);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let div = document.createElement('div');
            div.classList.add('day');
            div.textContent = i;
            div.dataset["time"] = `${i}-${month + 1}-${year}`;
            const divTitle = includeDate(mapped, `${i}-${month + 1}-${year}`)
            if (divTitle !== null) {
                div.appendChild(divTitle);

            } else if (isAdmin) {
                const spanAdmin = document.createElement('span');
                spanAdmin.classList.add('addSomething')
                spanAdmin.textContent = '+';
                div.appendChild(spanAdmin);
            }
            datesDiv.appendChild(div);
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        document.getElementById('monthYear').textContent = `${monthDecoded[month]} ${year}`;
        datesDiv.innerHTML = '';
        firstDayOfMonth = new Date(year, month, 1).getDay();
        daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i < firstDayOfMonth; i++) {
            let div = document.createElement('div');
            div.classList.add('day');
            div.classList.add('blackDay');
            datesDiv.appendChild(div);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let div = document.createElement('div');
            div.textContent = i;
            div.classList.add('day');
            div.dataset["time"] = `${i}-${month + 1}-${year}`;
            const divTitle = includeDate(mapped, `${i}-${month + 1}-${year}`)
            if (divTitle !== null) {
                div.appendChild(divTitle);

            } else if (isAdmin) {
                const spanAdmin = document.createElement('span');
                spanAdmin.classList.add('addSomething')
                spanAdmin.textContent = '+';
                div.appendChild(spanAdmin);
            }
            datesDiv.appendChild(div);
        }
    });

    window.addEventListener('scroll', function () {
        const scrolled = window.scrollY;
        if (scrolled > 20) { // если пользователь ниже 20 пикселей
            header.classList.add('-top-44'); // прячем часть страницы

        } else { // если меньше
            header.classList.remove('-top-44'); // показываем верхнюю часть страницы
        }
    });

    const modal = document.getElementById("myModal");
    setInterval(function () {
        const addSpans = document.querySelectorAll('.addSomething');
        addSpans.forEach(addSpan => {
            addSpan.addEventListener('click', () => {
                modal.style.display = "block";
                document.querySelector('#modalAdminClose').onclick = function () {
                    modal.style.display = "none";
                }
                modal.firstElementChild.dataset['time'] = addSpan.parentNode.dataset.time
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
            })
        })
    }, 1000)

    function parseDateStringToDateTime(dateString) {
        const dateParts = dateString.split('-');
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).toISOString();
    }

    function clearForm(arrInput) {
        arrInput.forEach(input => {
            input.value = '';
        })
    }

    btnAdminForm.addEventListener('click', (e) => {
        e.preventDefault();
        const dataTime = modal.firstElementChild.dataset.time
        const radio9 = radioButtonReg9.checked
        console.log('send')
        fetch(`${server}lesson`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'token': window.localStorage.getItem("token")
            }, body: JSON.stringify({
                title: formTitle.value,
                description: formDescription.value,
                youtubeLink: formYoutube.value,
                homework: formHomework.value,
                dateStart: parseDateStringToDateTime(dataTime),
                grade: radio9 ? 9 : 11,
            })
        }).then((r)=>{
            console.log(r)
        }).catch((e)=>{
            console.log(e)
        })
        clearForm([formTitle, formDescription, formYoutube, formHomework])
        document.querySelector('#modalAdminClose').click()
    })
    document.querySelectorAll(".titleLesson").forEach((lesson) => {
        lesson.addEventListener('click', async (e) => {
            openedLesson = e.target.id
            const lessonModal = document.querySelector('#lessonModal')
            const lessonInfo = mapped.filter((lessonInfo) => lessonInfo.id === Number(e.target.id))
            lessonTitle.textContent = lessonInfo[0].title
            lessonDescription.textContent = lessonInfo[0].description
            lessonYoutube.href = lessonInfo[0].youtubeLink.length > 0 ? lessonInfo[0].youtubeLink : '#'
            lessonHomework.textContent = lessonInfo[0].homework
            lessonModal.style.display = 'block'
            const responseComment = await fetch(`${server}comment/${openedLesson}`);
            const data = await responseComment.json();
            // clearDiv('commentContainer')
            data.lessons.forEach(([author, comment]) => {
                const div = document.createElement('div')
                div.classList.add('comment')
                div.textContent = comment
                const spanAuthor = document.createElement('span')
                spanAuthor.textContent = author
                spanAuthor.classList.add('commentAuthor')
                commentContainer.appendChild(spanAuthor)

                commentContainer.appendChild(div)
            })
            document.querySelector('#lessonClose').addEventListener('click', function () {
                console.log('click')
                lessonModal.style.display = "none";
            })

        })
    })
    // const commentInput = document.getElementById('commentInput')
    // document.getElementById('commentSend').addEventListener('click', () => {
    //     const comment = commentInput.value
    //     fetch(`${server}comment`, {
    //         method: 'POST', headers: {
    //             'Content-Type': 'application/json', 'token': window.localStorage.getItem("token")
    //         }, body: JSON.stringify({
    //             description: comment, lessonId: openedLesson
    //         })
    //     })
    //     commentInput.value = ''
    // })
}

function clearDiv(containerId) {
    const container = document.getElementById(containerId);

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

load()
