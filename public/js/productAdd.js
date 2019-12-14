/************************************************************
 *  This file Requires HTML elements with IDS
 ************************************************************/
const ProductAddFormLocationID = "addProductForm";
const ProductAddCatagoryFieldID = "productAddCatagoryField";
const ProductAddSubCatagoryFieldID = "productAddSubCatagoryField";

/************************************************************
 *  Ajax Call to add product to database
 ************************************************************/
function addProduct() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            updateProducts();
        };
    }
    var paramaters = "?";
    //Prepare the Get String
    var formLocation = document.getElementById(ProductAddFormLocationID);
    //For input elements
    var formElements = formLocation.getElementsByTagName("INPUT");
    for (var i = 0, element; element = formElements[i++];) {
        if (element.value != "" &&
            (!(element.getAttribute("name") == "Submit" || element.getAttribute("name") == "Reset"))) {
            paramaters += element.getAttribute("name") + "=" + element.value + "&";
        }
    }
    //For select elements
    var selectElements = formLocation.getElementsByTagName("SELECT");
    for (var i = 0, element; element = selectElements[i++];) {
        if (element.value != "" && element.value != "None") {
            paramaters += element.getAttribute("name") + "=" + element.value + "&";
        }
    }

    document.getElementById(ProductAddFormLocationID).reset();
    paramaters = paramaters.substring(0, paramaters.length - 1);
    xhttp.open("GET", "addProduct/addValidation" + paramaters, true);
    xhttp.send();
}


/************************************************************
 *  Add subcategory options to the Select tag
 ************************************************************/
function productAddSubCategoryOptions(reset = false) {
    let x = document.getElementById(ProductAddSubCatagoryFieldID);

    //Remove Existing subCategory options
    var list = x.getElementsByTagName("option")
    while (list.length > 1) {
        list[list.length - 1].remove();
    }

    if (reset == false) {
        //Query data base for sub categroy options
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhr = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var resArr = JSON.parse(this.responseText);
                console.log(resArr);
                let categoryName = document.getElementById(ProductAddCatagoryFieldID);
                resArr.forEach(element => {
                    if (categoryName.value == element.categoryid) {
                        var option = document.createElement("option");
                        option.text = element.sub_categoryname;
                        option.setAttribute("Value", element.id);
                        x.add(option);
                    }
                });
            }
        }
        xhr.open("GET", "/api/SubcategoryByName", true);
        xhr.send();
    }
}

/************************************************************
 *  Add category options to the Select tag
 *  Then load subcategory options
 ************************************************************/
function productAddCategoryOptions(async = true) {
    let x = document.getElementById(ProductAddCatagoryFieldID);

    //Create ajax request to get the categorys
    if (window.XMLHttpRequest) {
        // code for modern browsers
        var xhr = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resArr = JSON.parse(this.responseText);
            resArr.forEach(element => {
                var option = document.createElement("option");
                option.text = element.name;
                option.setAttribute("Value", element.id);
                x.add(option);
            });
        }

    }
    xhr.open("GET", "/api/Category", async);
    xhr.send();
}

/************************************************************
 *  Run this code when the Document is done loading
 *  So that we can add event listeners
 ************************************************************/
document.addEventListener("DOMContentLoaded", function () {

    productAddCategoryOptions();

    document.getElementById(ProductAddFormLocationID).addEventListener("submit", function (event) {
        event.preventDefault();
        addProduct();
    });

    document.getElementById(ProductAddFormLocationID).addEventListener("reset", function (event) {
        productAddSubCategoryOptions(true);
    });

    document.getElementById(ProductAddCatagoryFieldID).addEventListener("change", function (event) {
        productAddSubCategoryOptions();
    });
});