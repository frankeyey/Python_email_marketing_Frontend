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

    csvHeader.push(tempHeader)
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


var catcher = document.getElementById('catcher');
var imageInput = document.getElementById("my-image")
var fileList = [];
var renderFileList, sendFile;

/* Send All Image when Submit */
catcher.addEventListener('submit', function (evnt) {
  evnt.preventDefault();
  fileList.forEach(function (file) {
    sendFile(file);
  });
});

/* Method to create Image button */
imageInput.addEventListener('change', function() {
  fileList = [];
  for (let i = 0; i < this.files.length; i++) {
    fileList.push(imageInput.files[i]);
    if (this.files && this.files[i]) {
      imgUrl.push(URL.createObjectURL(this.files[i])); // set src to blob url
      let button = document.createElement('input')
      let imgName = this.files[i].name
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
  }
  
  return imgUrl, imgFormatedUrl
});

sendFile = function (file) {
  var formData = new FormData();
  var request = new XMLHttpRequest();

  formData.set('file', file);
  request.open("POST", '/sendEmails');
  request.send(formData);
};

document.getElementById("my-custom-attachment").addEventListener('change', function() {
  let upload_custom_attachment = document.getElementById("upload_custom_attachment")

  let radio_div = document.createElement("div")
  for (let i = 0; i < csvHeader.length; i++) {  
    let radio = document.createElement("input")
    let radio_label = document.createElement("label")
    let radio_text = document.createTextNode(csvHeader[i])
    radio.type = "radio"
    radio.id = "radio_" + csvHeader[i]
    radio.name = "selected_header"
    radio.value = csvHeader[i]
    radio_label.setAttribute("for", csvHeader[i])
    radio_label.className = "smaller_text"
    radio_label.appendChild(radio_text)
    radio_div.appendChild(radio)
    radio_div.appendChild(radio_label)
    upload_custom_attachment.append(radio_div)
  }
});

/* Method to see the sample output */
function seeOutput() {
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

function insertAtCursor(input, textToInsert) {
  // get current text of the input
  const value = input.value;

  // save selection start and end position
  const start = input.selectionStart;
  const end = input.selectionEnd;

  // update the value with our text inserted
  input.value = value.slice(0, start) + textToInsert + value.slice(end);

  // update cursor to be at the end of insertion
  input.selectionStart = input.selectionEnd = start + textToInsert.length;
}