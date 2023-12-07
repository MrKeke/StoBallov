let isAdmin = JSON.parse(window.localStorage.getItem("user")).user.isAdmin
const header = document.querySelector('header')
const radioButtonReg9 = document.querySelector('#nine')
const token = window.localStorage.getItem('token');
const userGrade = JSON.parse(window.localStorage.getItem("user")).user.grade
const btnAdminForm = document.getElementById("btn-admin-form");
const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");
const formYoutube = document.getElementById("form-youtube");
const formHomework = document.getElementById("form-homework");
const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const lessonYoutube = document.getElementById("lessonYoutube");
const lessonHomework = document.getElementById("lessonHomework");


window.onload = async function () {
    if (token === null) {
        window.href = '/'
    }
    const scrolled = window.scrollY;
    if (scrolled > 20) {
        header.classList.add('out');
    } else {
        header.classList.remove('out');

    }
}

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

function includeDate(mapped, date) {
    let currentLesson = mapped.filter((lesson) => {
        return lesson.dateStart === date
    })
    if (currentLesson[0]) {
        const div = document.createElement('div')
        div.textContent = currentLesson[0].title
        div.id = currentLesson[0].id
        div.classList.add('titleLesson')
        console.log(div)
        return div
    } else {
        return null
    }


}

async function load() {
    const response = await fetch('http://localhost:3001/lessons', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.getItem('token'),
        }
    });
    const data = await response.json()
    const mapped = data.lessons.map((lesson) => {
        const newDate = new Date(lesson.dateStart).toLocaleDateString('en-GB').split('/')
        newDate[0] = Number(newDate[0])
        lesson.dateStart = newDate.join('-')
        return lesson
    }).filter((lesson) => {
        if (isAdmin) {
            return true
        } else {
            return lesson.forGrade === userGrade
        }
    })
    document.getElementById('monthYear').textContent = `${monthDecoded[month]} ${year}`;

    let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let daysDiv = document.getElementById('days');
    days.forEach(day => {
        let time = `${day}-${month + 1}-${year}`;
        let div = document.createElement('div');
        div.textContent = day;
        daysDiv.appendChild(div);
    });

    let datesDiv = document.getElementById('dates');
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
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
            console.log(div)
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
        for (let i = 0; i < firstDayOfMonth; i++) {
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
                console.log(div)

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
        for (let i = 0; i < firstDayOfMonth; i++) {
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
                console.log(div)

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
        if (scrolled > 20) {
            header.classList.add('out');
        } else {
            header.classList.remove('out');

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
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            })
        })
    }, 1000)

    function parseDateStringToDateTime(dateString) {
        const dateParts = dateString.split('-');
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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
        fetch(`http://localhost:3001/lesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                title: formTitle.value,
                description: formDescription.value,
                youtubeLink: formYoutube.value,
                homework: formHomework.value,
                dateStart: parseDateStringToDateTime(dataTime),
                grade: radio9 ? 9 : 11,
            })
        })
        clearForm([formTitle, formDescription, formYoutube, formHomework])
        document.querySelector('#modalAdminClose').click()

    })
    document.querySelectorAll(".titleLesson").forEach((lesson) => {
        lesson.addEventListener('click', (e) => {
            const lessonModal = document.querySelector('#lessonModal')
            const lessonInfo = mapped.filter((lessonInfo)=>lessonInfo.id === Number(e.target.id))
            console.log(lessonInfo)
            lessonTitle.textContent = lessonInfo[0].title
            lessonDescription.textContent = lessonInfo[0].description
            lessonYoutube.href = lessonInfo[0].youtubeLink.length > 0 ? lessonInfo[0].youtubeLink : '#'
            lessonHomework.textContent = lessonInfo[0].homework
            lessonModal.style.display = 'block'
            document.getElementById('lessonClose').onclick = function () {
                lessonModal.style.display = "none";
            }
        })
    })
    const commentInput = document.getElementById('commentInput')
    // document.getElementById('commentSend').addEventListener('click', ()=>{
    //     fetch
    //
    // })
}

load()
