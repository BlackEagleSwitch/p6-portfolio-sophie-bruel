async function postLogin(email, password) {
    const postLogin = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    const login = await postLogin.json();
    return login;
}

function submitLogin() {
    const submit = document.querySelector('.submit');
    
    submit.addEventListener('click', async function() {
        const err = document.querySelector('h3');
        const email = document.querySelector('input[type=text]').value;
        const password = document.querySelector('input[type=password]').value;

        if (email && password) {
            const login = await postLogin(email, password);
            const token = login.token;
            if (token) {
                sessionStorage.setItem('token', token);
                location.replace('./../../index.html');
            }
            else {
                err.style.display = "flex";
                err.textContent = "Erreur, champ(s) incorrect(s)";
            }
        }
        else {
            err.style.display = "flex";
            err.textContent = "Erreur, champ(s) incomplet(s)";
        }
    });
}
submitLogin();