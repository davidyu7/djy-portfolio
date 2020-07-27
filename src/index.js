const URL = "http://localhost:3000"

const homeContainer = document.querySelector("#home-content-container")
const activeContainer = document.querySelector("#active-content-container")
const commentForm = document.querySelector("#comment-form")

document.querySelector("#navlink-home").addEventListener("click", showHome)
document.querySelector("#navlink-folders").addEventListener("click", showFolders)
document.querySelector("#navlink-categories").addEventListener("click", showCategories)
document.querySelector("#navlink-tags").addEventListener("click", showTags)

commentForm.addEventListener("submit", e => {
    e.preventDefault()

    fetch(`${URL}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            project_id: e.target[0].value,
            email: e.target[2].value,
            display_name: e.target[3].value,
            content: e.target[1].value
        })
    })
    .then(() => displayProject(e.target[0].value))
})

function resetPage() {
    activeContainer.innerHTML = ''
    homeContainer.style.display = "none"
    commentForm.style.display = "none"
}

function showHome() {
    resetPage()

    homeContainer.style.display = "block"
}

function showFolders() {
    resetPage()

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
    resetPage()

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
    resetPage()

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
    h3.addEventListener("click", function() {
        displayProject(project.id)
    })
    
    const p = document.createElement("p")
    p.textContent = project.description

    container.append(h3, p)

    return container
}

function displayProject(id) {
    resetPage()
    commentForm.style.display = "block"
    commentForm.reset()

    fetch(`${URL}/projects/${id}`)
    .then(response => response.json())
    .then(project => {

        const h4 = document.createElement("h4")
        const categoryLink = document.createElement("a")
        categoryLink.textContent = project.category.name
        const folderLink = document.createElement("a")
        folderLink.textContent = project.folder.name
        h4.append(categoryLink, " / ", folderLink)

        const h1 = document.createElement("h1")
        h1.textContent = project.title

        const p = document.createElement("p")
        p.textContent = project.description

        const tagsContainer = document.createElement("h4")
        project.tags.forEach(tag => {
            const tagLink = document.createElement("a")
            tagLink.textContent = `#${tag.name}`
            tagsContainer.append(tagLink, " ")
        })

        const imagesContainer = document.createElement("div")
        project.images.forEach(image => {
            const imageContainer = document.createElement("div")
            const img = document.createElement("img")
            img.src = image.src_url
            imageContainer.appendChild(img)
            imagesContainer.appendChild(imageContainer)
        })

        const commentsContainer = document.createElement("div")
        const commentTitle = document.createElement("h1")
        commentTitle.innerText = "Comments"
        commentsContainer.appendChild(commentTitle)
        project.comments.forEach(comment => {
            const commentContainer = document.createElement("div")
            const displayName = document.createElement("h4")
            displayName.innerText = comment.display_name
            const commentContent = document.createElement("p")
            commentContent.innerText = comment.content

            commentContainer.append(displayName, commentContent)
            
            commentsContainer.appendChild(commentContainer)
        })

        activeContainer.append(h4, h1, p, tagsContainer, imagesContainer, commentsContainer)

        commentForm.querySelector("#form-project-id").value = project.id

    })
}