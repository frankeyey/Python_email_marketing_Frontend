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
    console.log(tempHeader)
    let formatedHeader = "${" + tempHeader + "}"
    console.log(formatedHeader)

    csvHeader.push(tempHeader)
    csvFormatedHeader.push(formatedHeader)
    csvData.push(tempData)
    button.type = "button"
    button.id = i
    button.value = tempHeader
    formatedHeader = formatedHeader.replace("\n","")
    button.onclick = function() {
      insertAtCaret("input_content",formatedHeader)
    }
    document.getElementById("varFromCsv").append(button)
  }
  return csvData, csvHeader, csvFormatedHeader
};

var imageInput = document.getElementById("my-image")
var mediaList = [];

/* Method to create Image button */
imageInput.addEventListener('change', function() {
  for (let i = 0; i < this.files.length; i++) {
    if (this.files && this.files[i].name) {
      imgUrl.push(URL.createObjectURL(this.files[i])); // set src to blob url
      let button = document.createElement('input')
      let imgName = this.files[i].name
      let formatedImageTag= "${[" + imgName + "]}"

      mediaList.push(this.files[i]);
      imgFormatedUrl.push(formatedImageTag)
      button.type = "button"
      button.id = imgName
      button.value = imgName
      button.onclick = function() {
        insertAtCaret("input_content",formatedImageTag)
      }
      document.getElementById("varFromCsv").append(button)
    }
  }
  return imgUrl, imgFormatedUrl, mediaList
});

var catcher = document.getElementById('catcher');

/* Send All Image when Submit */
catcher.addEventListener('submit', function (evnt) {
  evnt.preventDefault();
  var formData = new FormData();
  var request = new XMLHttpRequest();

  let subject_field = document.getElementById("subject_field").value
  let content_field = document.getElementById("input_content").value
  let targets_csv = document.getElementById("dealCsv").files[0]
  let custom_attachment = document.getElementById("my-custom-attachment").files[0]
  let selected_header = document.querySelector('input[name="selected_header"]:checked').value;
  let submitBtn = document.getElementById("testBtn").value

  formData.append('subject_field', subject_field)
  formData.append('content_field', content_field)
  formData.append('targets_csv', targets_csv)
  formData.append('custom-attachment', custom_attachment)
  formData.append('selected_header', selected_header)
  formData.append('submitBtn', submitBtn)
  mediaList.forEach(function (file) {
    formData.append('media', file)
  });
  request.open("POST", '/sendEmails');
  request.send(formData);
});

document.getElementById("my-attachment").addEventListener('change', function() {
  for (let i = 0; i < this.files.length; i++) {
    mediaList.push(this.files[i])
  }
  return mediaList
})

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

function insertAtCaret(areaId,text) {
  var txtarea = document.getElementById(areaId);
  var scrollPos = txtarea.scrollTop;
  var strPos = 0;
  var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
    "ff" : (document.selection ? "ie" : false ) );
  if (br == "ie") { 
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart ('character', -txtarea.value.length);
    strPos = range.text.length;
  }
  else if (br == "ff") strPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0,strPos);  
  var back = (txtarea.value).substring(strPos,txtarea.value.length); 
  txtarea.value=front+text+back;
  strPos = strPos + text.length;
  if (br == "ie") { 
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart ('character', -txtarea.value.length);
    range.moveStart ('character', strPos);
    range.moveEnd ('character', 0);
    range.select();
  }
  else if (br == "ff") {
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();
  }
  txtarea.scrollTop = scrollPos;
}