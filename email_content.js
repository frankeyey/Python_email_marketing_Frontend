let csvHeader= []
let csvData = []
let csvFormatedHeader = []
let imgUrl = []
let imgFormatedUrl = []

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

/* Method for parse csv data and create button */
uploadDealcsv.prototype.getParsecsvdata = function(data) {
  
  let parsedata = [];

  let newLinebrk = data.split("\n");
  for (let i = 0; i < newLinebrk.length; i++) {
    parsedata.push(newLinebrk[i].split(","));
  }

  /* Generate button based on parsedata */
  for (let i =0; i < parsedata[0].length; i++) {
    let button = document.createElement('input')
    let tempHeader = parsedata[0][i]
    let tempData = parsedata[1][i]
    let formatedHeader = "${" + tempHeader + "}"

    csvFormatedHeader.push(formatedHeader)
    csvData.push(tempData)
    button.type = "button"
    button.id = i
    button.value = tempHeader
    button.onclick = function() {
      document.getElementById("input_content").value += formatedHeader
      getBackToInput()
    }
    document.getElementById("varFromCsv").append(button)
  }
  return csvData, csvHeader, csvFormatedHeader
};

/* Method to create Image button */
document.getElementById("my-image").addEventListener('change', function() {
  if (this.files && this.files[0]) {
      imgUrl.push(URL.createObjectURL(this.files[0])); // set src to blob url
      let button = document.createElement('input')
      let imgName = this.files[0].name
      let formatedImageTag= "${[" + imgName + "]}"

      imgFormatedUrl.push(formatedImageTag)
      button.type = "button"
      button.id = imgName
      button.value = imgName
      button.onclick = function() {
        document.getElementById("input_content").value += formatedImageTag
        getBackToInput()
      }
      document.getElementById("varFromCsv").append(button)
  }
  return imgUrl, imgFormatedUrl
});

/* Method to see the sample output */
function seeOutput() {
  console.log(imgFormatedUrl)
  let output = document.getElementById("output_content")
  let input = document.getElementById("input_content").value.split("\n").join("<br>");
  output.style.display = "block"

  for (let i = 0; i < csvFormatedHeader.length; i++) {  //Replace each ${} with respective sample data
    var searchString = input.search(csvFormatedHeader[i])   //Check if any ${} exist
    var changeVariable = input.split(csvFormatedHeader[i]).join(csvData[i])
    input = changeVariable
  }
  
  for (let i = 0; i < imgFormatedUrl.length; i++) {  //Replace each ${} with respective sample data
    var searchImage = input.search(imgFormatedUrl[i])   //Check if any ${} exist
    var changeVariable = input.split(imgFormatedUrl[i]).join("<img src=" + imgUrl[i] + " style='max-width: 100%'>")
    input = changeVariable
  }
  
  if (searchString || searchImage) {
    output.innerHTML = changeVariable
  } else {
    output.innerHTML = input
  }
  getBackToInput()
}

function getBackToInput() {
  document.getElementById("input_content").focus()
}

var parseCsv = new uploadDealcsv();
parseCsv.getCsv();