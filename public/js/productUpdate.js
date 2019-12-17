/************************************************************
 *  This file Requires HTML elements with IDS
 ************************************************************/
const TableLocationID = "ProductTable";
const FormLocationID = "SearchForm";
const CatagoryFieldID = "CatagoryField";
const SubCatagoryFieldID = "SubCatagoryField";

var showID = Boolean(false);

function addRowData(row, data) {
    row.setAttribute("Class", "TableBody");
    //console.log(data);
    //Display all the data
    if (data.productsid != undefined) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data.productsid;
        if(showID == false){
            cell.style.display = "none";
        }
    }
    if (data.categoryname != undefined) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data.categoryname;
    }
    if (data.sub_categoryname != undefined) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data.sub_categoryname;
    }
    if (data.rarityname != undefined && data.productsname != undefined) {
        var cell = row.insertCell(-1);
        cell.setAttribute("class", data.rarityname);
        cell.innerHTML = data.productsname;
    }
    if (data.productsquantity != undefined) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data.productsquantity;
    }
    if (data.productsprice != undefined) {
        var cell = row.insertCell(-1);
        cell.innerHTML = data.productsprice;
    }
}

/************************************************************
 *  Display Producut table data
 ************************************************************/
function displayTableData(tableID, data) {

    //Delete all table rows that contain td
    var table = document.getElementById(tableID);
    //Clear body

    var body = table.getElementsByTagName("tbody")[0];
    body.innerHTML = "";

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        //If the quanity is zero add it to the end else add it second to last
        var row = body.insertRow(-1); //Create new row and make it the last row
        addRowData(row, obj);

    } //For var i

    /***
     *  Insert latter would be nice to add but 
     *  might confuse people reviewing code
     *  Would have to delete the for loop above
     */
    /*
    var insertLater = new Array();
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        //If the quanity is zero add it to the end else add it second to last
        if(obj.productsquantity > 0){
            var row = table.insertRow(-1); //Create new row and make it the last row
            addRowData(row, obj);
        }
        else{
            insertLater.push(obj);
            continue;
        }
    } //For var i
    insertLater.forEach(obj =>{
        var row = table.insertRow(-1); //Create new row and make it the last row
        addRowData(row, obj)
    });
    */
}
/************************************************************
 *  Run this function on load
 ************************************************************/
function loadDoc() {
    //Return array of values
    // "productsid":10        ,"categoryname":"Sword" ,"sub_categoryname":"Short_Sword",
    // "rarityname":"Common"  ,"productsname":"Sting",
    // "productsquantity":1000,"productsprice":25

    var table = document.getElementById(TableLocationID);

    //Add Table Headers
    var header = table.createTHead();
    var hrow = header.insertRow(0);
    hrow.setAttribute("Class", "TableHeader");

    //Add each cell
    var HeaderText = new Array();
    HeaderText.push("ID");
    HeaderText.push("Category");
    HeaderText.push("Subcategory");
    HeaderText.push("Name");
    HeaderText.push("Quantity");
    HeaderText.push("Price");

    HeaderText.forEach(element => {
        var cell = hrow.insertCell(-1);
        cell.innerHTML = element;
        //console.log(element);
        
        //Hide ID column
        if(element == "ID" && showID == false){
            cell.style.display = "none";
        }
    });

    table.createTBody();

    // Add parameters in string to search form
    let form = document.getElementById(FormLocationID);
    let queryString = location.search;
    let params = new URLSearchParams(queryString);

    for (const [key, value] of params.entries()) {
        let query = form.querySelectorAll(`[name=${key}]`);
        if (query.length == 1 && value != null) {
            query[0].value = value;
        }
    }

    updateProducts();
}

/************************************************************
 *  updateProducts
 *  If reset = true request the form again without and 
 *  search parmaters
 *  
 *  A function that makes a ajax request to get the main product
 *  information form then update the TableLocationID with the new 
 *  info
 ************************************************************/
function updateProducts(reset = false) {
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
            var table = document.getElementById(TableLocationID);

            displayTableData(TableLocationID, resArr);
        }
    }

    var paramaters = "";
    if (reset == false) {
        //Add paramaters to string
        //Get String is prepared
        //Pass in the current GET Paramaters
        var paramaters = "";
        //Prepare the Get String
        var getString = "?";
        var formLocation = document.getElementById(FormLocationID);

        //For input elements
        var formElements = formLocation.getElementsByTagName("INPUT");
        for (var i = 0, element; element = formElements[i++];) {
            if (element.value != "" &&
                (!(element.getAttribute("name") == "Submit" || element.getAttribute("name") == "Reset"))) {
                getString += element.getAttribute("name") + "=" + element.value + "&";
            }
        }
        //For select elements
        var selectElements = formLocation.getElementsByTagName("SELECT");
        for (var i = 0, element; element = selectElements[i++];) {
            if (element.value != "" && element.value != "None") {
                getString += element.getAttribute("name") + "=" + element.value + "&";
            }
        }
        //Trim last charactar of the string to prevent errors
        getString = getString.substring(0, getString.length - 1);
        window.history.replaceState(null, null, getString);

        paramaters = getString;

    }
    //Else if we are resting the form
    else {
        addSubCategoryOptions(true);
    }

    xhr.open("GET", "/api/productTable" + paramaters, true);
    xhr.send();
}

/************************************************************
 *  Add subcategory options to the Select tag
 ************************************************************/
function addSubCategoryOptions(reset = false) {
    let x = document.getElementById(SubCatagoryFieldID);

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
                let categoryName = document.getElementById(CatagoryFieldID);
                resArr.forEach(element => {
                    if (categoryName.value == element.categoryname) {
                        var option = document.createElement("option");
                        option.text = element.sub_categoryname;
                        option.setAttribute("Value", element.sub_categoryname);
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
 *  Almost the same as addSubCategoryOptions()
 *  But set its value then calls loadDoc()
 ************************************************************/
function loadAddSubCategoryOptions() {
    let x = document.getElementById(SubCatagoryFieldID);

    //Remove Existing subCategory options
    var list = x.getElementsByTagName("option")
    while (list.length > 1) {
        list[list.length - 1].remove();
    }

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
            let categoryName = document.getElementById(CatagoryFieldID);
            resArr.forEach(element => {
                if (categoryName.value == element.categoryname) {
                    var option = document.createElement("option");
                    option.text = element.sub_categoryname;
                    option.setAttribute("Value", element.sub_categoryname);
                    x.add(option);
                }
            });

            // Set the value to the value in the URL
            let form = document.getElementById(FormLocationID);
            let queryString = location.search;
            let params = new URLSearchParams(queryString);

            let query = form.querySelectorAll(`[name=SubCategory]`);

            if (query.length == 1 && params.get("SubCategory") != null) {
                query[0].value = params.get("SubCategory");
            }
            loadDoc();
        }
    }
    xhr.open("GET", "/api/SubcategoryByName", true);
    xhr.send();
}

/************************************************************
 *  Add category options to the Select tag
 *  Then load subcategory options
 ************************************************************/
function addCategoryOptions(async = true) {
    let x = document.getElementById(CatagoryFieldID);

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
                option.setAttribute("Value", element.name);
                x.add(option);
            });

            // Set the value to the value in the URL
            let form = document.getElementById(FormLocationID);
            let queryString = location.search;
            let params = new URLSearchParams(queryString);

            let query = form.querySelectorAll(`[name=Category]`);

            if (query.length == 1 && params.get("Category") != null) {
                query[0].value = params.get("Category");
            }

            loadAddSubCategoryOptions();
        }

    }
    xhr.open("GET", "/api/Category", async);
    xhr.send();
}

/************************************************************
 *  Run this code when the Document is done loading
 *  So that we can add event listeners
 ************************************************************/
if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
    document.addEventListener("DOMContentLoaded", function () {

        //This funciton call other functions after is done
        addCategoryOptions(true);

        document.getElementById(FormLocationID).addEventListener("submit", function (event) {
            event.preventDefault();
            updateProducts();
        });
        document.getElementById(FormLocationID).addEventListener("reset", function (event) {
            updateProducts(true);
        });

        document.getElementById(CatagoryFieldID).addEventListener("change", function (event) {
            addSubCategoryOptions();
        });
    });

} else if (document.attachEvent) { // For IE 8 and earlier versions
    document.attachEvent("load", function () {

        //This funciton call other functions after is done
        (true);

        document.getElementById(FormLocationID).addEventListener("submit", function (event) {
            event.preventDefault();
            updateProducts();
        });
        document.getElementById(FormLocationID).addEventListener("reset", function (event) {
            updateProducts(true);
        });

        document.getElementById(CatagoryFieldID).addEventListener("change", function (event) {
            addSubCategoryOptions();
        });
    });
}
