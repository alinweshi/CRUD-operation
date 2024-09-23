let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let quantity = document.getElementById("quantity");
let count = document.getElementById("count");
let title = document.getElementById("title");
let category = document.getElementById("category");
let total = document.getElementById("total");
let create = document.getElementById("create");
let updateBtn = document.getElementById("updateBtn");
let deleteBtn = document.getElementById("deleteBtn");
let deleteSelected = document.getElementById("deleteSelected");
let deleteAll = document.getElementById("deleteAll");
let mood = 'create';
let tmp;

// Calculate and display total
function getTotal() {
    let priceValue = parseFloat(price.value) || 0;
    let taxesValue = parseFloat(taxes.value) || 0;
    let adsValue = parseFloat(ads.value) || 0;
    let discountValue = parseFloat(discount.value) || 0;
    let result = priceValue + taxesValue + adsValue - discountValue;
    total.innerHTML = result.toFixed(2);
    total.style.background = priceValue ? "blue" : "green";
}

// Event listeners for updating total dynamically
price.addEventListener("keyup", getTotal);
taxes.addEventListener("keyup", getTotal);
ads.addEventListener("keyup", getTotal);
discount.addEventListener("keyup", getTotal);
quantity.addEventListener("keyup", getTotal);

let dataProducts = JSON.parse(localStorage.getItem("product")) || [];

// Clear input fields
function clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    quantity.value = "";
    category.value = "";
    total.innerHTML = "";
}

// Display product data in table
function showData() {
    let table = "";
    for (let i = 0; i < dataProducts.length; i++) {
        table += `
        <tr>
            <td><input type="checkbox" class="select-row" data-index="${i}"></td>
            <td>${i + 1}</td>
            <td>${dataProducts[i].title}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].quantity}</td>
            <td>${dataProducts[i].category}</td>
            <td><button onclick="editData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete" >Delete</button></td>
        </tr>
        `;
    }
    document.getElementById("productsTableBody").innerHTML = table;
    deleteAll.style.display = dataProducts.length === 0 ? "none" : "block";
    attachDeleteSelectedEvent();
}

// Attach event listener for 'Delete Selected' button
function attachDeleteSelectedEvent() {
    deleteSelected.onclick = function () {
        const selected = document.querySelectorAll(".select-row:checked");
        if (selected.length === 0) {
            alert("Please select at least one product to delete.");
            return;
        }
        selected.forEach(checkbox => {
            const index = checkbox.dataset.index;
            dataProducts.splice(index, 1);
        });
        localStorage.setItem("product", JSON.stringify(dataProducts));
        showData();
    };
}

function createProduct() {
    let newProduct = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        quantity: quantity.value,
        category: category.value.toLowerCase()
    };
    if (mood === 'create') {
        for (let i = 0; i < (parseInt(count.value) || 1); i++) {
            dataProducts.push(newProduct);
        }
    } else {
        dataProducts[tmp] = newProduct;
    }


    localStorage.setItem("product", JSON.stringify(dataProducts));
    clearData();
    showData();
}
// Add a new product
create.addEventListener("click", createProduct);

// Delete a single product by index
function deleteData(index) {
    dataProducts.splice(index, 1);
    localStorage.setItem("product", JSON.stringify(dataProducts));
    showData();
}

// Delete all products
deleteAll.onclick = function () {
    dataProducts = [];
    localStorage.removeItem("product");
    showData();
};
/*-------------------------------------------------------------------------------------------*/
// Edit product data
function editData(index) {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    const product = dataProducts[index];
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    category.value = product.category;
    total.innerHTML = product.total;
    quantity.value = product.quantity;
    getTotal();
    mood = "update";

    count.style.display = "none";
    updateBtn.style.display = "block";
    deleteBtn.style.display = "block";
    updateBtn.style.width = "50%";
    deleteBtn.style.width = "50%";
    create.style.display = "none";
    document.querySelector(".title").style.marginTop = "30px";
    updateBtn.onclick = function () {

        dataProducts[index] = {
            title: title.value,
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            quantity: quantity.value,
            category: category.value
        };
        localStorage.setItem("product", JSON.stringify(dataProducts));
        tmp = index;

        showData();
        clearData();
        count.style.display = "block";
        updateBtn.style.display = "none";
        deleteBtn.style.display = "none";
        create.style.display = "block";
    };
    deleteBtn.onclick = function () {
        deleteData(index);
    }
}
/*------------------------------------------------------------------------------------*/
/*                           *search part                                             */
let searchByTitle = document.getElementById("searchByTitle");
let searchByCategory = document.getElementById("searchByCategory");
let search = document.getElementById("search");


let searchMood = "title";
search.addEventListener('mouseover', function () {
    search.style.transition = "width 0.3s ease, margin 0.3s ease";
    search.style.width = "110%";
    search.style.marginLeft = "-5%";
});

search.addEventListener('mouseout', function () {
    search.style.transition = "width 0.3s ease, margin 0.3s ease";
    search.style.width = "100%";
    search.style.marginLeft = "0";
});


function getSearchMood(id) {

    if (id == "searchByTitle") {
        search.placeholder = "Search By Title";
        searchMood = 'title';
    } else if (id == "searchByCategory") {
        search.placeholder = "Search By Category";
        searchMood = 'category';
    }
}
function searchData(value) {
    let filteredData = [];
    for (let i = 0; i < dataProducts.length; i++) {
        if (searchMood === 'title') {
            if (dataProducts[i].title.includes(value.toLowerCase())) {
                filteredData.push(dataProducts[i]);
            } else {
                search.placeholder = 'No Result Found';
            }
        } else if (searchMood === 'category') {
            if (dataProducts[i].category.includes(value.toLowerCase())) {
                filteredData.push(dataProducts[i]);
            } else {
                search.placeholder = 'No Result Found';
            }
        }
    }
    // Handle no results found
    if (filteredData.length === 0 && value !== '') {
        search.placeholder = 'No Result Found';
    }
    displayData(filteredData);
}
function displayData(filteredData) {
    let table = "";
    for (let i = 0; i < filteredData.length; i++) {
        table += `
        <tr>
            <td><input type="checkbox" class="select-row" data-index="${i}"></td>
            <td>${i + 1}</td>
            <td>${filteredData[i].title}</td>
            <td>${filteredData[i].price}</td>
            <td>${filteredData[i].taxes}</td>
            <td>${filteredData[i].ads}</td>
            <td>${filteredData[i].discount}</td>
            <td>${filteredData[i].total}</td>
            <td>${filteredData[i].quantity}</td>
            <td>${filteredData[i].category}</td>
            <td><button onclick="editData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete" >Delete</button></td>
        </tr>
        `;
        document.getElementById("productsTableBody").innerHTML = table;;
    }
}
/*------------------------------------------------------------------------------------*/
showData();
