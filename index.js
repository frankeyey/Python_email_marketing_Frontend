function uploadDealcsv() {}

/* Method for read uploded csv file */
uploadDealcsv.prototype.getCsv = function(e) {
  let input = document.getElementById("dealCsv");
  input.addEventListener("change", function() {
    if (this.files && this.files[0]) {
      var myFile = this.files[0];
      var reader = new FileReader();

      reader.addEventListener("load", function(e) {
        let csvdata = e.target.result;
        parseCsv.getParsecsvdata(csvdata); // calling function for parse csv data
      });

      reader.readAsBinaryString(myFile);
    }
  });
};

let globalData = []

/* Method for parse csv data and display */
uploadDealcsv.prototype.getParsecsvdata = function(data) {
  
  let parsedata = [];

  let newLinebrk = data.split("\n");
  for (let i = 0; i < newLinebrk.length; i++) {
    parsedata.push(newLinebrk[i].split(","));
  }

  /* Generate button based on parsedata */
  for (let i =0; i < parsedata[0].length; i++) {
    let button = document.createElement('input')
    button.type = "button"
    button.id = i
    button.value = parsedata[0][i]
    button.onclick = function() {
      let formatedData = "${" + parsedata[0][i] + "}"
      document.getElementById("input_content").value += formatedData
    }
    document.getElementById("varFromCsv").append(button)
  }
};

function seeOutput() {
  let output = document.getElementById("output_content")
  output.innerHTML = document.getElementById("input_content").value.split("\n").join("<br>");

}

var parseCsv = new uploadDealcsv();
parseCsv.getCsv();