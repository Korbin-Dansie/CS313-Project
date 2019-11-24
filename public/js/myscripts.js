function loadDoc() {
  {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if(document.getElementById("RarityInfo") != null){
          document.getElementById("RarityInfo").innerHTML = this.responseText;
        }
      }
    };
    xhttp.open("GET", "/api/rarity", true);
    xhttp.send();
  }

  {
    //Return array of values
    // "productsid":10        ,"categoryname":"Sword" ,"sub_categoryname":"Short_Sword",
    // "rarityname":"Common"  ,"productsname":"Sting",
    // "productsquantity":1000,"productsprice":25

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var resArr = JSON.parse(this.responseText);
        var table = document.getElementById("ProductTable");
        //Add Table Headers
        var header = table.createTHead();
        var hrow = header.insertRow(0);  
        hrow.setAttribute("Class", "TableHeader");
                for (const x in resArr[0]) {
          // x + ":" + obj[x]
          var cell = hrow.insertCell(-1);
          cell.innerHTML = x;
        }//for const x for header


        for (var i = 0; i < resArr.length; i++) {
          var obj = resArr[i];
          var row = table.insertRow(-1); //Create new row and make it the last row
          row.setAttribute("Class", "TableBody");

          //Display Each Item By TAG : Value
          for (const x in obj) {
            // x + ":" + obj[x]
            var cell = row.insertCell(-1);
            cell.innerHTML = obj[x];
          }//for const x
          
        }//For var i
      }
    }
    xhttp.open("GET", "/api/productTable", true);
    xhttp.send();
  }

}