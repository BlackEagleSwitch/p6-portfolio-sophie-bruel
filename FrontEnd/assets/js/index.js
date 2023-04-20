const gallery = document.querySelector('.gallery');
const divFilters = document.querySelector('.filters');
const banderolle = document.querySelector('#banderolle');
const admin = document.querySelectorAll('.admin');
const modale = document.querySelector('.modale');
const shadow = document.querySelector('.shadow');

const token = sessionStorage.getItem('token');
if (token) {
    for (let value of admin) {
        value.style.display = "flex";
    }
    banderolle.style.display = "flex";
    divFilters.style.display = "none";
}

async function getWorksAPI() {
    const getWorks = await fetch("http://localhost:5678/api/works");
    const dataWorks = await getWorks.json();
    return dataWorks;
}

async function getCategoryAPI() {
    const getCategory = await fetch("http://localhost:5678/api/categories");
    const dataCategory = await getCategory.json();
    return dataCategory;
}

async function main() {
    const dataWorks = await getWorksAPI();
    const dataCategory = await getCategoryAPI();

    createFigure(dataWorks, gallery);
    filters(dataCategory, dataWorks);

    openModale(dataWorks);
}
main();

function createFigure(dataWorks, container) {
    for (let data of dataWorks) {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${data.imageUrl}">
            <figcaption>${data.title}</figcation>
        `;
        container.appendChild(figure);
    }
}

function filters(dataCategory, dataWorks) {
    createFilters(dataCategory);
    const allFilters = divFilters.children;

    allFilters[0].addEventListener('click', () => {
        gallery.innerHTML = "";
        createFigure(dataWorks, gallery);
        colorFilters(allFilters[0]);
    });

    for (let i = 1; i < allFilters.length; i++) {
        allFilters[i].addEventListener('click', () => {
            const newList = dataWorks.filter(function (data) {
                return data.categoryId === i;
            });
            colorFilters(allFilters[i]);
            gallery.innerHTML = "";
            createFigure(newList, gallery);
        });
    }
}

function createFilters(dataCategory) {
    const btnAll = document.createElement('button');
    btnAll.textContent = "Tous";
    divFilters.appendChild(btnAll);

    for (let category of dataCategory) {
        const filter = document.createElement('button');
        filter.textContent = category.name;
        divFilters.appendChild(filter);
    }
}

function colorFilters(actif) {
    const allFilters = divFilters.children;
    for (let btn of allFilters) {
        btn.style.backgroundColor = "transparent";
        btn.style.color = "#1D6154";
    }
    actif.style.backgroundColor = "#1D6154";
    actif.style.color = "white";
}

function openModale(dataWorks) {
    const btnModale = document.querySelector('.btnModale');
    btnModale.addEventListener('click', () => {
        pageOneModale(dataWorks);
    });
}

function pageOneModale(dataWorks) {
    shadow.style.display = "flex";
    modale.style.display = "flex";
    modale.innerHTML = `
        <span>
            <i class="fa-solid fa-arrow-left"></i>
            <i class="fa-solid fa-xmark"></i>
        </span>
        <h2>Galerie photo</h2>
        <div class="divModale pageOne"></div>
        <button class="addPicture">Ajouter une photo</button>
        <button class="supGallery">Supprimer la galerie</button>
    `;

    const btnReturn = document.querySelector('.fa-arrow-left');
    btnReturn.style.zIndex = "-2";

    const divModale = document.querySelector('.divModale');
    createFigure(dataWorks, divModale);

    const figures = divModale.children;
    for (let figure of figures) {
        const del = document.createElement('i');
        del.className = 'fas fa-ban';
        figure.appendChild(del);
    }

    const btnDelete = document.querySelectorAll('.fa-ban');
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].value = dataWorks[i].id;
    }

    const figuresModale = document.querySelectorAll('.divModale figure figcaption');
    for (let figcaption of figuresModale) {
        figcaption.textContent = "éditer";
    }

    const close = document.querySelector('.fa-xmark');
    closeModale(shadow, dataWorks);
    closeModale(close, dataWorks);
    pageTwoModale(dataWorks);
    deleteGallery();
    deleteFigure();
}

function pageTwoModale(dataWorks) {
    const button = document.querySelector('.addPicture');
    button.addEventListener('click', () => {
        const btnReturn = document.querySelector('.fa-arrow-left');
        const titleModale = document.querySelector('.modale h2');
        titleModale.textContent = "Ajout photo";
        btnReturn.style.zIndex = "0";

        const contModale = document.querySelector('.pageOne');
        contModale.classList.remove('pageOne');
        contModale.classList.add('pageTwo');

        const divModale = document.querySelector('.divModale');
        divModale.innerHTML = `
            <div class="backBlue"></div>
            <label>Titre</label>
            <input type="text">
            <label>Catégorie</label>
            <select>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>
            </select>
        `;

        const btnSupGallery = document.querySelector('.supGallery');
        btnSupGallery.remove();

        const btnValidation = document.querySelector('.addPicture');
        btnValidation.style.backgroundColor = "#A7A7A7";
        btnValidation.style.border = "solid 1px #A7A7A7";
        btnValidation.textContent = "Valider";

        const backBlue = document.querySelector('.backBlue');
        backBlue.innerHTML = `
            <i class="far fa-image"></i>
            <b>+ Ajouter photo</b>
            <p>jpg, png : 4mo max</p>
            <div class="preview"></div>
            <input type="file">
        `;

        const close = document.querySelector('.fa-xmark');
        returnPageOne(btnReturn, dataWorks);
        closeModale(shadow, dataWorks);
        closeModale(close, dataWorks);
        addNewFigure();
    });
}

function deleteFigure() {
    const allDelete = document.querySelectorAll('.fa-ban');
    for (let btn of allDelete) {
        btn.addEventListener('click', () => {
            const id = btn.value;

            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
        });
    }
}

function deleteGallery() {
    const supGallery = document.querySelector('.supGallery');
    const allFigure = document.querySelectorAll('.divModale .fa-ban');
    supGallery.addEventListener('click', () => {
        for (let value of allFigure) {
            const id = value.value;
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${token}`
                }
            });
        }
    });
}

function addNewFigure() {
    const btnValidation = document.querySelector('.addPicture');
    const inputFile = document.querySelector('input[type=file]');

    inputFile.addEventListener('change', (input) => {
        const imgUrl = input.target.files[0];
        btnValidation.style.backgroundColor = "#1D6154";
        previewImg(imgUrl);
    });

    btnValidation.addEventListener('click', () => {
        const img = inputFile.files[0];
        const category = document.querySelector('select').value;
        const title = document.querySelector('.divModale input[type=text]').value;

        const data = new FormData();
        data.append("image", img);
        data.append("title", title);
        data.append("category", category);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: data
        });
    });
}

function previewImg(imgUrl) {
    const btnHide = document.querySelector('.backBlue b');
    const preview = document.querySelector('.preview');
    const img = document.createElement('img');
    btnHide.style.display = "none";
    preview.style.zIndex = "2";

    const url = new FileReader();
    url.readAsDataURL(imgUrl);
    url.onload = function (url) {
        img.src = url.target.result;
        preview.appendChild(img);
    }
}

function closeModale(btn, dataWorks) {
    btn.addEventListener('click', () => {
        shadow.style.display = "none";
        modale.style.display = "none";
        modale.innerHTML = "";
        openModale(dataWorks);
    });
}

function returnPageOne(btn, dataWorks) {
    btn.addEventListener('click', () => {
        modale.innerHTML = "";
        pageOneModale(dataWorks);
    });
}