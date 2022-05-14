'strick mode';
const fetchHeaders = {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
};

const baseUrl = window.location.origin;
const pagesEnum = {
    signUp: 'sign-up.html',
    signIn: 'sign-in.html',
    home: 'home.html',
    index: undefined,
};
const userTokenKey = 'user-token';
const userCredentialKey = 'user-credential';

const userTokenElement = document.querySelector('#user-token');

(function () {
    redirectGuard();
})();

function redirectGuard() {
    const windowPath = window.location.pathname.split('/').splice(2, 3)?.[0];
    const userToken = localStorage.getItem(userTokenKey);

    if (windowPath === pagesEnum.index) {
        redirectTo(pagesEnum.signIn);
    } else if (windowPath === pagesEnum.home && !userToken) {
        redirectTo(pagesEnum.signIn);
    } else if (windowPath === pagesEnum.home && userToken) {
        setProfile();
    }
}

function redirectTo(path) {
    window.location.replace(`${baseUrl}/pages/${path}`);
}

function signUpForm() {
    const userName = event.target.elements?.userName?.value;
    const userPassword = event.target.elements?.password?.value;

    (async () => {
        await fetch('http://localhost:3000/sign-up', {
            ...fetchHeaders,
            method: 'POST',
            body: JSON.stringify({ username: userName, password: userPassword }),
        })
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem(userCredentialKey, JSON.stringify(data));
                redirectTo(pagesEnum.signIn);
            })
            .catch((error) => console.error(error));
    })();
    event.preventDefault();
}

function signInForm(event) {
    const userName = event.target.elements?.userName?.value;
    const userPassword = event.target.elements?.password?.value;

    (async () => {
        await fetch('http://localhost:3000/log-in', {
            ...fetchHeaders,
            method: 'POST',
            body: JSON.stringify({ username: userName, password: userPassword }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem(userTokenKey, data.token);

                    redirectTo(pagesEnum.home);
                }
            })
            .catch((error) => console.error(error));
    })();

    event.preventDefault();
}

function setProfile() {
    const token = localStorage.getItem(userTokenKey);

    userTokenElement.innerHTML = token;
}

function logOut() {
    localStorage.removeItem(userTokenKey);
    localStorage.removeItem(userCredentialKey);

    redirectGuard();
}
