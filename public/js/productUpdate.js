/************************************************************
 *  This file Requires HTML elements with IDS
 ************************************************************/
const TableLocationID = "ProductTable";
const FormLocationID = "SearchForm";
const CatagoryFieldID = "CatagoryField"
const SubCatagoryFieldID = "SubCatagoryField"


/************************************************************
 *  Run this code when the Document is done loading
 *  So that we can add event listeners
 ************************************************************/
if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById(FormLocationID).addEventListener("submit", function (event) {
            event.preventDefault();
            updateProducts();
        });
        document.getElementById(FormLocationID).addEventListener("reset", function (event) {
            updateProducts(true);
        });

        addCategoryOptions();

        document.getElementById(CatagoryFieldID).addEventListener("change", function (event) {
            addSubCategoryOptions();
        });
    });

} else if (document.attachEvent) { // For IE 8 and earlier versions
    document.attachEvent("load", function () {
        document.getElementById(FormLocationID).addEventListener("submit", function (event) {
            event.preventDefault();
            updateProducts();
        });
        document.getElementById(FormLocationID).addEventListener("reset", function (event) {
            updateProducts(true);
        });

        addCategoryOptions();

        document.getElementById(CatagoryFieldID).addEventListener("change", function (event) {
            addSubCategoryOptions();
        });
    });

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
            //Delete all table rows that contain td
            var tableBodyLength = table.getElementsByClassName("TableBody").length;
            console.info('Table length:' + (tableBodyLength - 1));

            for (var i = tableBodyLength; i > 0; i = tableBodyLength) {
                //console.info('Table Element:' + table.getElementsByClassName("TableBody")[tableBodyLength - 1]);
                //console.info('Table Element Num:' + tableBodyLength);
                table.getElementsByClassName("TableBody")[tableBodyLength - 1].remove();
                tableBodyLength = table.getElementsByClassName("TableBody").length;
            }

            //Add table rows for each item
            for (var i = 0; i < resArr.length; i++) {
                var obj = resArr[i];
                var row = table.insertRow(-1); //Create new row and make it the last row
                row.setAttribute("Class", "TableBody");

                //Display Each Item By TAG : Value
                for (const x in obj) {
                    // x + ":" + obj[x]
                    var cell = row.insertCell(-1);
                    cell.innerHTML = obj[x];
                } //for const x

            } //For var i
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
        paramaters = getString;
    }

    xhr.open("GET", "/api/productTable" + paramaters, true);
    xhr.send();
}

/************************************************************
 *  Add category options to the Select tag
 ************************************************************/
function addCategoryOptions() {
    var x = document.getElementById(CatagoryFieldID);

    //Create ajax request to get the categorys
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
            resArr.forEach(element => {
                var option = document.createElement("option");
                option.text = element.name;
                option.setAttribute("Value", element.name);
                x.add(option);    
            });
        }
    }
    xhr.open("GET", "/api/Category", true);
    xhr.send();
}

/************************************************************
 *  Add subcategory options to the Select tag
 ************************************************************/
function addSubCategoryOptions(){
    var x = document.getElementById(SubCatagoryFieldID);
    var option = document.createElement("option");
    option.text = "kiwi";
    option.setAttribute("Value", "element.name");
    x.add(option);    
}