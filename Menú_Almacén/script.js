const API_URL = "http://localhost:3000/productos";

// Cargar productos desde el servidor
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderCategories(data);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Renderizar categorías en el menú desplegable
function renderCategories(data) {
    const categorySelect = document.getElementById("categorySelect");
    categorySelect.innerHTML = `<option value="">Seleccione una categoría</option>`;

    Object.keys(data).forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Renderizar subcategorías
function renderSubcategories() {
    const category = document.getElementById("categorySelect").value;
    const subcategorySelect = document.getElementById("subcategorySelect");
    subcategorySelect.innerHTML = `<option value="">Seleccione una subcategoría</option>`;

    if (!category) return;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            Object.keys(data[category]).forEach(subcategory => {
                const option = document.createElement("option");
                option.value = subcategory;
                option.textContent = subcategory;
                subcategorySelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar subcategorías:", error));
}

// Renderizar productos
function renderProducts() {
    const category = document.getElementById("categorySelect").value;
    const subcategory = document.getElementById("subcategorySelect").value;
    const menuList = document.getElementById("menu");

    menuList.innerHTML = "";

    if (!category || !subcategory) return;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data[category][subcategory].forEach((product, index) => {
                const li = document.createElement("li");
                li.innerHTML = `${product} 
                    <button class='edit-btn' onclick="editProduct('${category}', '${subcategory}', ${index}, '${product}')">Editar</button>
                    <button class='delete-btn' onclick="deleteProduct('${category}', '${subcategory}', ${index})">Eliminar</button>`;
                menuList.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Agregar un producto
async function addProduct() {
    const category = document.getElementById("categorySelect").value;
    const subcategory = document.getElementById("subcategorySelect").value;
    const productInput = document.getElementById("productName");
    const productName = productInput.value.trim();

    if (!category || !subcategory || !productName) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, subcategory, product: productName }),
        });

        if (response.ok) {
            productInput.value = "";
            renderProducts();
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

// Eliminar un producto
async function deleteProduct(category, subcategory, index) {
    await fetch(`${API_URL}/${category}/${subcategory}/${index}`, { method: "DELETE" });
    renderProducts();
}

// Editar un producto
async function editProduct(category, subcategory, index, oldProduct) {
    const newProduct = prompt("Editar producto:", oldProduct);
    if (!newProduct || newProduct.trim() === "") return;
    await fetch(`${API_URL}/${category}/${subcategory}/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: newProduct })
    });
    renderProducts();
}

// Cargar datos al iniciar
loadProducts();