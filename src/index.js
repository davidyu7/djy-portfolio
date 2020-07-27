const URL = "http://localhost:3000"

const homeContainer = document.querySelector("#home-content-container")
const activeContainer = document.querySelector("#active-content-container")

document.querySelector("#navlink-home").addEventListener("click", showHome)
document.querySelector("#navlink-folders").addEventListener("click", showFolders)
document.querySelector("#navlink-categories").addEventListener("click", showCategories)
document.querySelector("#navlink-tags").addEventListener("click", showTags)

function showHome() {
    activeContainer.innerHTML = ""
    homeContainer.style.display = "block"
}

function showFolders() {
    homeContainer.style.display = "none"
    activeContainer.innerHTML = ""

    const displayTitle = document.createElement("h1")
    displayTitle.textContent = "Projects by Role"
    activeContainer.appendChild(displayTitle)

    fetch(`${URL}/folders`)
    .then(response => response.json())
    .then(folders => {
        folders.forEach(folder => {
            activeContainer.append(makeContainer(folder))
        })
    })
}

function showCategories() {
    homeContainer.style.display = "none"
    activeContainer.innerHTML = ""

    const displayTitle = document.createElement("h1")
    displayTitle.textContent = "Projects by Category"
    activeContainer.appendChild(displayTitle)

    fetch(`${URL}/categories`)
    .then(response => response.json())
    .then(categories => {
        console.log(categories)
        categories.forEach(category => {
            activeContainer.append(makeContainer(category))
        })
    })
}

function showTags() {
    homeContainer.style.display = "none"
    activeContainer.innerHTML = ""

    const displayTitle = document.createElement("h1")
    displayTitle.textContent = "Projects by Tag"
    activeContainer.appendChild(displayTitle)

    fetch(`${URL}/tags`)
    .then(response => response.json())
    .then(tags => {
        tags.forEach(tag => {
            activeContainer.append(makeContainer(tag))
        })
    })
}

function makeContainer(object) {
    const container = document.createElement("div")
    
    const h2 = document.createElement("h2")
    h2.textContent = object.name
    container.append(h2)

    if (object.hasOwnProperty('description')){
        const p = document.createElement("p")
        p.textContent = object.description
        container.append(p)
    }
    
    object.project_previews.forEach(preview => {
        container.append(displayPreview(preview))
    })

    return container
}

function displayPreview(project) {
    const container = document.createElement("div")
    container.style.backgroundImage = `url('${project.thumbnail_url}')`

    const h3 = document.createElement("h3")
    h3.textContent = project.title
    
    const p = document.createElement("p")
    p.textContent = project.description

    container.append(h3, p)

    return container
}