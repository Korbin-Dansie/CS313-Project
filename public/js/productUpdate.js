function updateProducts(reset = false) {
    var xhr = new XMLHttpRequest();
    const formLocationID = "SearchForm";
    const TableLocationID = "ProductTable";

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

    //Add paramaters to string
    //Get String is prepared
    //Pass in the current GET Paramaters

    var paramaters = "";
    //Prepare the Get String
    var getString = "?";
    var formLocation = document.getElementById(formLocationID);
    var formElements = formLocation.getElementsByTagName("INPUT");

    for (var i = 0, element; element = formElements[i++];) {
        if (element.value != "" &&
            (!(element.getAttribute("name") == "Submit" || element.getAttribute("name") == "Reset"))) {
            getString += element.getAttribute("name") + "=" + element.value + "&";
        }
    }
    var selectElements = formLocation.getElementsByTagName("SELECT");
    for (var i = 0, element; element = selectElements[i++];) {
        if (element.value != "" && element.value != "None") {
            getString += element.getAttribute("name") + "=" + element.value + "&";
        }
    }
    //Trim last charactar of the string to prevent errors
    getString = getString.substring(0, getString.length - 1);
    
    //TODO Get this working
    if(reset == true){
        paramaters = "";
    }
    else{
        paramaters = getString;
    }
    /*
    if (getString.length > 0) {
        //Add paramaters to url with page refreash
        window.history.replaceState(null, null, getString);

        if (location.search != null) {
            paramaters = location.search.toString();
        }
    }*/

    console.info("paramaters:" + paramaters);
    xhr.open("GET", "/api/productTable" + paramaters, true);
    xhr.send();
}