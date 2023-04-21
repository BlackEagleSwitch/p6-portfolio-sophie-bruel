async function postLogingAPI(email, password) {
    const postLogin = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    const dataLogin = await postLogin.json();
    return dataLogin;
}

function submitLogin() {
    const msgError = document.querySelector('h3');
    const submit = document.querySelector('button');

    submit.addEventListener('click', async function() {
        const email = document.querySelector('input[type=text]').value;
        const password = document.querySelector('input[type=password]').value;

        if (email && password) {
            const login = await postLogingAPI(email, password);
            const token = login.token;

            if (token) {
                sessionStorage.setItem('token', token);
                location.replace('./../../index.html');
            }
            else {
                msgError.style.display = "flex";
                msgError.textContent = "Champ(s) incorrect(s)";
            }
        }
        else {
            msgError.style.display = "flex";
            msgError.textContent = "Champ(s) vide(s)";
        }
    });
}
submitLogin();