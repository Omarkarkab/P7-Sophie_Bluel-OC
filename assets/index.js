// Fonction asynchrone pour récupérer les projets depuis l'API
async function getProjects() {
    const response = await fetch("http://localhost:5678/api/works")
    const projects = await response.json()
    return projects
}

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    const categories = await response.json()
    return categories
}

// Fonction asynchrone pour afficher les projets filtrés
async function displayProjects(filterCategory = -1) {
    const projects = await getProjects()
    const gallery = document.querySelector('.gallery')
    gallery.innerHTML = ""
    const filteredProjects = filterCategory === -1 ? projects : projects.filter(project => project.categoryId === filterCategory)
    filteredProjects.forEach(project => {
        const figureElement = document.createElement('figure')
        const imgElement = document.createElement('img')
        const figCaptionElement = document.createElement('figcaption')
        imgElement.src = project.imageUrl
        imgElement.alt = project.title
        figCaptionElement.textContent = project.title
        figureElement.appendChild(imgElement)
        figureElement.appendChild(figCaptionElement)
        gallery.appendChild(figureElement)
    })
}

// Fonction pour créer un bouton de filtre pour une catégorie donnée
function createFilterButton(category) {
    const button = document.createElement('button')
    button.textContent = category.name
    button.classList.add('filter-button')
    button.setAttribute('data-category', category.id)
    if (category.id === -1) {
        button.classList.add('active')
    }
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'))
        button.classList.add('active')
        displayProjects(category.id)
    })
    return button
}

// Fonction asynchrone pour afficher les boutons de filtres
async function displayFilters() {
    const categories = await getCategories()
    categories.unshift({ "id": -1, "name": "Tous" })
    const filterContainer = document.querySelector('.filters')
    categories.forEach(category => {
        const filterButton = createFilterButton(category)
        filterContainer.appendChild(filterButton)
    })
}

// Affiche initialement les filtres et les projets
displayFilters()
displayProjects()
