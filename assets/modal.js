// Sélectionner les éléments modaux
const modal = document.getElementById("photoModal");
const addPhotoModal = document.getElementById("addPhotoModal");



// Sélectionner les boutons et les éléments interactifs
const modifyBtn = document.getElementById("modifyBtn");
const closeBtn = document.getElementsByClassName("close")[0];
const addPhotoBtn = document.getElementById("addPhotoBtn");
const addPhotoModalCloseBtn = addPhotoModal.getElementsByClassName("close")[0];
const fileInput = document.getElementById("picture");
const previewPicture = document.querySelector(".preview-picture");
const placeholderContainer = document.querySelector(".placeholder-container");
const backToGalleryBtn = document.getElementById("backToGallery");
const submitModalButton = document.getElementById("submit-img-modal");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");

// Ajouter des event listeners
modifyBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
addPhotoBtn.addEventListener("click", openAddPhotoModal);
addPhotoModalCloseBtn.addEventListener("click", closeAddPhotoModal);
fileInput.addEventListener("change", handleFileChange);
backToGalleryBtn.addEventListener("click", () => {
    closeAddPhotoModal();
    openModal();
});
submitModalButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleSavePhoto();
});

// Ajouter des event listeners pour la validation
titleInput.addEventListener("input", validateForm);
categoryInput.addEventListener("change", validateForm);
fileInput.addEventListener("change", validateForm);


// Fonction de validation du formulaire
function validateForm() {
    const isTitleValid = titleInput.value.trim() !== "";
    const isCategoryValid = categoryInput.value !== "";
    const isFileValid = fileInput.files.length > 0;

    if (isTitleValid && isCategoryValid && isFileValid) {
        submitModalButton.disabled = false;
    } else {
        submitModalButton.disabled = true;
    }
}

// Ouvrir la première modale (Galerie photo)
function openModal() {
    modal.style.display = "block";
}

// Fermer la première modale
function closeModal() {
    modal.style.display = "none";
}
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = "none";
    }
    else if (e.target == addPhotoModal) {
        addPhotoModal.style.display = "none";
    }
}

// Ouvrir la seconde modale (Ajout photo)
function openAddPhotoModal() {
    // Fermer la première modale avant d'ouvrir la seconde
    closeModal();
    addPhotoModal.style.display = "block";
}

// Fermer la seconde modale
function closeAddPhotoModal() {
    addPhotoModal.style.display = "none";
}

// Afficher projets dans la modale
async function displayModalProjects() {
    const projects = await getProjects()
    const gallery = document.querySelector('.photo-gallery')
    gallery.innerHTML = ""

    projects.forEach(project => {
        const divElement = document.createElement('div')
        const imgElement = document.createElement('img')
        const buttonElement = document.createElement("i")
        divElement.classList.add("photo-item")
        buttonElement.classList.add('delete-btn', "fa-solid", "fa-trash-can")
        buttonElement.addEventListener('click', () => {
            removeProject(project.id);
        })
        imgElement.src = project.imageUrl
        imgElement.alt = project.title
        divElement.appendChild(imgElement)
        divElement.appendChild(buttonElement)
        gallery.appendChild(divElement)
    })
}

// Supprimer un projet
async function removeProject(id) {
    const response = await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("authToken") },
    });
    if (response.ok) {
        displayModalProjects(); // Mettre à jour la galerie après l'ajout 
        displayProjects(); // Mettre à jour la galerie principale 
    } else if (response.status === 400) {
        errorMessage.textContent = "Échec du chargement de l'image : Veuillez vérifier les données soumises.";
    } else if (response.status === 401) {
        errorMessage.textContent = "Échec du chargement de l'image :  Vous n'avez pas l'autorisation de faire cette action.";
    } else {
        errorMessage.textContent = "Échec du chargement de l'image : Une erreur inattendue s'est produite.";
    }
}
displayModalProjects()

// Gestion de l'aperçu d'image
function handleFileChange(event) {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Assigner l'URL de l'image à l'attribut src de l'image de prévisualisation
            previewPicture.src = e.target.result;
            previewPicture.alt = file.name;
            previewPicture.style.display = "block"; // Afficher l'image
            placeholderContainer.style.display = "none"; // Masquer le placeholder
        }

        reader.readAsDataURL(file); // Lire le fichier comme une URL de données

        validateForm(); // Appeler validateForm pour vérifier si le fichier est valide
    }
}

async function handleSavePhoto() {

    const file = document.querySelector(".input-file").files[0];
    const title = document.getElementById("title").value;
    const categoryId = document.getElementById('category').value;

    if (!file || !title || !categoryId) {
        alert("Veuillez remplir tous les champs."); return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": "Bearer " + localStorage.getItem("authToken") },
            body: formData

        });

        if (response.ok) {
            closeAddPhotoModal();
            displayModalProjects(); // Mettre à jour la galerie après l'ajout 
            displayProjects(); // Mettre à jour la galerie principale 
        } else if (response.status === 400) {
            errorMessage.textContent = "Échec du chargement de l'image : Veuillez vérifier les données soumises.";
        } else if (response.status === 401) {
            errorMessage.textContent = "Échec du chargement de l'image :  Vous n'avez pas l'autorisation de faire cette action.";
        } else {
            errorMessage.textContent = "Échec du chargement de l'image : Une erreur inattendue s'est produite.";
        }
    } catch (error) {
        console.error("Erreur:", error);
        errorMessage.textContent = "Échec du chargement de l'image : Une erreur est survenue lors de l'ajout du projet.";
    }

}

// Ajout Categorie dans select Modal
async function addOptionInSelect() {
    const categories = await getCategories()
    const selectCategory = document.getElementById("category")
    for (category of categories) {
        const option = new Option(category.name, category.id)
        selectCategory.appendChild(option)
    }
}
addOptionInSelect()