const header = document.querySelector('header')
const navLinks = document.querySelector("#nav-links")
const modal = document.getElementById("feedBackModal");
const span = document.getElementsByClassName("close")[0];
const feedBackTitle = document.getElementById("feedbackTitle");
const feedBackDescription = document.getElementById("feedbackDescription")

// При загрузке проверка на пользователя
window.onload = async function () {
    const token = window.localStorage.getItem("token");
    if (token) {
        try {
            const data = await fetch('http://localhost:3001/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            }).then(response => response.json());
            window.localStorage.setItem("user", JSON.stringify(data));
            const user = JSON.parse(window.localStorage.getItem("user"))
            // Вывод личного кабинета
            const fullName = `${user.user.firstName.slice(0, 1)}${user.user.lastName.slice(0, 1)}`
            const authDiv = document.querySelector('#auth')
            const cabinet = document.querySelector('#cabinet')
            authDiv.style.display = 'none';
            cabinet.style.display = 'block';
            cabinet.textContent = fullName;

        } catch (error) {
            // на случай ошибок
            console.log(error);
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
        }
    } else {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
    }
}

function logout() {
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("user")
    window.href = '/'
}

// Логика хедера и его скрытия
window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;

    if (scrolled > 20) {
        header.classList.add('out');
        navLinks.classList.add("displayNone");

    } else {
        header.classList.remove('out');

    }
});
// переход в личный кабинет
document.querySelector("#cabinet").addEventListener("click", () => {
    navLinks.classList.toggle("displayNone");
});
// Выход
document.querySelector("#logout").addEventListener("click", () => {
    logout()
})

document.querySelector('#feedBack').addEventListener('click', () => {
    modal.style.display = "block";
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})
document.querySelector('#feedbackSend').addEventListener('click',(e)=>{
    e.preventDefault();
    const title = feedBackTitle.value
    const description = feedBackDescription.value
// сохранение фидбека на сервер
    fetch('http://localhost:3001/feedback',{
        method: 'POST',
        headers: {'Content-Type': 'application/json',token: token ? token : ''},
        body: JSON.stringify({
            title,description
        })
    })
    span.click()
})

