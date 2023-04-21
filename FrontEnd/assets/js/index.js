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
    createFilters(dataCategory, dataWorks);
    showModale(dataWorks);
}
main();

function createFigure(dataWorks, container, edit) {
    for (let data of dataWorks) {
        const figure = document.createElement('figure');
        if (edit === "edit") {
            figure.innerHTML = `
                <i class="fas fa-ban"></i>
                <img src="${data.imageUrl}" alt="Image">
                <figcaption>éditer</figcaption>
            `;
        }
        else {
            figure.innerHTML = `
                <img src="${data.imageUrl}" alt="Image">
                <figcaption>${data.title}</figcaption>
            `;
        }
        container.appendChild(figure);
    }
}

function createFilters(dataCategory, dataWorks) {
    const btnAll = document.createElement('button');
    btnAll.textContent = "Tous";
    divFilters.appendChild(btnAll);

    for (let category of dataCategory) {
        const btn = document.createElement('button');
        btn.textContent = category.name;
        divFilters.appendChild(btn);
    }
    filters(dataWorks);
}

function filters(dataWorks) {
    const buttons = divFilters.children;
    buttons[0].addEventListener('click', () => {
        gallery.innerHTML = "";
        createFigure(dataWorks, gallery);
        colorsBtn(buttons[0], buttons);
    });

    for (let i = 1; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            const newList = dataWorks.filter(function (data) {
                return data.categoryId === i;
            });
            colorsBtn(buttons[i], buttons);
            gallery.innerHTML = "";
            createFigure(newList, gallery);
        });
    }
}

function colorsBtn(actif, buttons) {
    for (let btn of buttons) {
        btn.style.backgroundColor = "white";
        btn.style.color = "#1D6154";
    }
    actif.style.backgroundColor = "#1D6154";
    actif.style.color = "white";
}

function showModale(dataWorks) {
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
            <i class="fas fa-arrow-left"></i>
            <i class="fas fa-xmark"></i>
        </span>
        <h2>Galerie photo</h2>
        <div class="divModale pageOne"></div>
        <button class="addPicture">Ajouter une photo</button>
        <button class="supGallery">Supprimer la galerie</button>
    `;
    const btnReturn = document.querySelector('.fa-arrow-left');
    const divModale = document.querySelector('.divModale');
    const btnClose = document.querySelector('.fa-xmark');
    btnReturn.style.zIndex = "-1";

    createFigure(dataWorks, divModale, "edit");
    pageTwo(dataWorks, divModale, btnReturn, btnClose);
    deleteFigure(dataWorks);
    closeModale(btnClose);
    closeModale(shadow);
    deleteGallery();
}

function pageTwo(dataWorks, divModale, btnReturn, btnClose) {
    const btnPageTwo = document.querySelector('.addPicture');
    btnPageTwo.addEventListener('click', () => {
        const title = document.querySelector('.modale h2');
        title.textContent = "Ajout photo";

        divModale.classList.remove('pageOne');
        divModale.classList.add('pageTwo');
        btnReturn.style.zIndex = "0";
        divModale.innerHTML = `
            <div class="backBlue">
                <i class="fas fa-image"></i>
                <b>+ Ajouter photo</b>
                <p>jpg, png : 4mo max</p>
                <div class="preview"></div>
                <input type="file">
            </div>
            <label>Titre</label>
            <input type="text">
            <label>Catégorie</label>
            <select>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>
            </select>
            <h3></h3>
        `;

        const buttons = document.querySelectorAll('.modale button');
        buttons[0].remove();
        buttons[1].remove();
        
        const btnValidation = document.createElement('button');
        btnValidation.className = "validation";
        btnValidation.textContent = "Valider";
        modale.appendChild(btnValidation);

        returnPageOne(btnReturn, dataWorks);
        closeModale(btnClose);
        closeModale(shadow);
        addNewFigure();
    });
}

function returnPageOne(btnReturn, dataWorks) {
    btnReturn.addEventListener('click', () => {
        pageOneModale(dataWorks);
    });
}

function closeModale(btn) {
    btn.addEventListener('click', () => {
        shadow.style.display = "none";
        modale.style.display = "none";
    });
}

function deleteFigure(dataWorks) {
    const buttonsDlt = document.querySelectorAll('.fa-ban');
    for (let i = 0; i < dataWorks.length; i++) {
        buttonsDlt[i].value = dataWorks[i].id;
    }
    for (let btn of buttonsDlt) {
        btn.addEventListener('click', () => {
            const id = btn.value;
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
        });
    }
} 

function deleteGallery() {
    const buttonsDlt = document.querySelectorAll('.fa-ban');
    const btnSupGallery = document.querySelector('.supGallery');
    btnSupGallery.addEventListener('click', () => {
        for (let btn of buttonsDlt) {
            const id = btn.value;
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
        }
    });
}

function addNewFigure() {
    const btnValidation = document.querySelector('.validation');
    const inputFile = document.querySelector('input[type=file]');

    inputFile.addEventListener('change', () => {
        const imgUrl = inputFile.files[0];
        const img = document.createElement('img');
        const btnHide = document.querySelector('b');
        const preview = document.querySelector('.preview');

        btnValidation.style.backgroundColor = "#1D6154";
        btnHide.style.display = "none";
        preview.style.zIndex = "2";
        
        const url = new FileReader();
        url.readAsDataURL(imgUrl);
        url.onload = function() {
            img.src = url.result;
            preview.appendChild(img);
        };
    });

    btnValidation.addEventListener('click', () => {
        const msgError = document.querySelector('.divModale h3');
        const imgUrl = document.querySelector('input[type=file]').files[0];
        const title = document.querySelector('.divModale input[type=text]').value;
        const category = document.querySelector('select').value;

        if (imgUrl && title) {
            const data = new FormData();
            data.append('image', imgUrl);
            data.append('title', title);
            data.append('category', category);

            fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
        } 
        else if (!imgUrl || !title) {
            msgError.textContent = "Image ou Titre manquant";
            msgError.style.display = "flex";
        }
        else {
            msgError.textContent = "Oups.. il y a un probleme";
            msgError.style.display = "flex";
        }
    });
}