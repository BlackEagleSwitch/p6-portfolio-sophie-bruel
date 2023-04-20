const gallery = document.querySelector('.gallery');
const divFilters = document.querySelector('.filters');

const shadow = document.querySelector('.shadow');
const modale = document.querySelector('.modale');

const banderolle = document.querySelector('#banderolle');
const admin = document.querySelectorAll('.admin');

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
        createFigure(dataWorks);
        colorFilters(allFilters[0]);
    });

    for (let i = 1; i < allFilters.length; i++) {
        allFilters[i].addEventListener('click', () => {
            const newList = dataWorks.filter(function(data) {
                return data.categoryId === i;
            });
            colorFilters(allFilters[i]);
            gallery.innerHTML = "";
            createFigure(newList);
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

        const figuresModale = document.querySelectorAll('.divModale figure figcaption');
        for (let figcaption of figuresModale) {
            figcaption.textContent = "éditer";
        }        
    });
}