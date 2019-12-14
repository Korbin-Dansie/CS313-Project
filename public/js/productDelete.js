const DeleteTableLocationID = "ProductTable";

function addToTable() {
    let table = document.getElementById(DeleteTableLocationID);
    //console.log(table);
    let body = table.getElementsByTagName("tbody")[0];
    //console.log(body);
}

function deleteRow(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            updateProducts();
        }
    };
    xhttp.open("GET", "deleteProduct/deleteValidation" + `?id=${id}`, true);
    xhttp.send();
}
/************************************************************
 *  Run this code when the Document is done loading
 *  So that we can add event listeners
 ************************************************************/
document.addEventListener("DOMContentLoaded", function () {
    let table = document.getElementById(DeleteTableLocationID);
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    };

    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log(mutation.addedNodes.length);
                //console.log(mutation);

                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].parentNode.nodeName == "TBODY" && mutation.addedNodes[0].nodeName == "TR") {

                        let row = mutation.addedNodes[0];

                        //Get Row data
                        let data = new Array();
                        row.childNodes.forEach(element => {
                            data.push(element.innerHTML);
                            //console.log(element.innerHTML);
                        });

                        //Create a button for deleting rows
                        let cell = row.insertCell(0);
                        let btn = document.createElement("BUTTON");
                        btn.innerHTML = "Delete";

                        btn.onclick = function () {
                            deleteRow(data[0]);
                        };

                        //Add button to Cell
                        cell.appendChild(btn);


                    } else if (mutation.addedNodes[0].parentNode.nodeName == "THEAD" && mutation.addedNodes[0].nodeName == "TR") {
                        let row = mutation.addedNodes[0];
                        let cell = row.insertCell(0);
                        cell.innerHTML = "";
                    }
                }
            } 
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(table, config);

    //table.addEventListener("DOMNodeInserted", function(){
    //   addToTable()
    //});
});