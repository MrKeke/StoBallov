const header = document.querySelector('header')

window.onload = async function () {
    const token = window.localStorage.getItem("token");
    if (token) {
        try{
            const data = await fetch('http://localhost:3001/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            }).then(response => response.json());
            window.localStorage.setItem("user", JSON.stringify(data));
            const authDiv = document.querySelector('#auth')
            const cabinet = document.querySelector('#cabinet')
            authDiv.style.display = 'none';
            cabinet.style.display = 'block';

        }catch(error){
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
        }
    }else {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
    }
}
async function logout(){
    fetch('http://localhost:3001/logout', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.getItem("token"),
        }.then(response => {
            if(response.status === 200){
                alert('Logout successful');
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = '/';
            }else{
                alert('Logout failed');
            }

        })
    })
}


window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;

    if (scrolled > 20) {
        header.classList.add('out');
    } else {
        header.classList.remove('out');
    }
});

