const header = document.querySelector('header')
const navLinks = document.querySelector("#nav-links")

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
            const fullName = `${user.user.firstName.slice(0, 1)}${user.user.lastName.slice(0, 1)}`
            const authDiv = document.querySelector('#auth')
            const cabinet = document.querySelector('#cabinet')
            const testLesson = document.querySelector('#testLesson')
            authDiv.style.display = 'none';
            testLesson.style.display = 'none';
            cabinet.style.display = 'block';
            cabinet.textContent = fullName;

        } catch (error) {
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


window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;

    if (scrolled > 20) {
        header.classList.add('out');
        navLinks.classList.add("displayNone");

    } else {
        header.classList.remove('out');

    }
});
document.querySelector("#cabinet").addEventListener("click", () => {
    navLinks.classList.toggle("displayNone");
});
document.querySelector("#logout").addEventListener("click", () => {
    logout()
})

