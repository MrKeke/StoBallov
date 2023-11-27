const buttonReg = document.querySelector('#register-button');
const emailInputReg = document.querySelector('#email-register');
const passwordInputReg = document.querySelector('#password-register');
const passwordConfirmInputReg = document.querySelector('#password-confirm-register');
const firstNameInputReg = document.querySelector('#first-name-register');
const lastNameInputReg = document.querySelector('#last-name-register');
const errorReg = document.querySelector('#error-register');

const buttonLogin = document.querySelector('#button-login');
const emailInputLogin = document.querySelector('#email-login');
const passwordInputLogin = document.querySelector('#password-login');
const errorLogin = document.querySelector('#error-login');

window.onload = () => {
    if (window.localStorage.getItem('token') !== null || undefined) {
        window.location.href = '/';
    }
}

function showError(elementArray, errorDiv, errorMessage) {
    elementArray.forEach(element => {
        element.style.border = '1px solid red';
        element.style.borderRadius = '5px';
    });
    errorDiv.innerHTML = errorMessage;
    errorDiv.style.display = 'block';
}

async function register(email, password, firstName, lastName) {
    const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    })
    const data = await response.json();
    if (response.status === 200) {
        window.localStorage.setItem("token", data.token);
        window.location.href = '/';
    } else if (response.status === 401) {
        showError([emailInputReg, passwordInputReg, passwordConfirmInputReg], errorReg, 'Пользователь с таким email уже зарегистрирован');
    }

}

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            window.localStorage.setItem("token", data.token);
            window.location.href = '/';
        } else if (response.status === 401) {
            showError([emailInputLogin, passwordInputLogin], errorLogin, data.error);
        }
        return true
    } catch (e) {
        console.log(e.message);
        return false
    }
}

// register
buttonReg.addEventListener('click', (e) => {
    [emailInputReg, passwordInputReg, passwordConfirmInputReg].forEach(element => {
        element.style.border = '1px solid black';
    })
    e.preventDefault();
    const email = emailInputReg.value.trim();
    const password = passwordInputReg.value.trim();
    const passwordConfirm = passwordConfirmInputReg.value.trim();
    const firstName = firstNameInputReg.value.trim();
    const lastName = lastNameInputReg.value.trim();
    if (email === '' || password === '' || passwordConfirm === '' || firstName === '' || lastName === '') {
        showError([emailInputReg, passwordInputReg, passwordConfirmInputReg, firstNameInputReg, lastNameInputReg], errorReg, 'Заполните все поля')
    } else if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) === null) {
        showError([emailInputReg], errorReg, 'Введите корректный email')
    } else if (password !== passwordConfirm) {
        showError([passwordInputReg, passwordConfirmInputReg], errorReg, 'Пароли не совпадают');
    } else if (password.length < 6) {
        showError([passwordInputReg, passwordConfirmInputReg], errorReg, 'Пароль должен быть не менее 6 символов');
    } else {
        register(email, password, firstName, lastName).then((result) => {
            console.log(result);
        });
    }
})

buttonLogin.addEventListener('click', (e) => {
    e.preventDefault();
    [emailInputLogin, passwordInputLogin].forEach(element => {
        element.style.border = '1px solid black';
    })
    const email = emailInputLogin.value.trim();
    const password = passwordInputLogin.value.trim();
    if (email === '' || password === '') {
        showError([emailInputLogin, passwordInputLogin], errorLogin, 'Заполните все поля')
    } else if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) === null) {
        showError([emailInputLogin], errorLogin, 'Введите корректный email')
    } else {
        login(email, password).then((result) => {
            console.log(result);
        });
    }

})
