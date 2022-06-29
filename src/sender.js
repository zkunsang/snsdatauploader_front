const snsdataurl = "localhost"

function _post(url, data, fn) {
  fetch(`http://${snsdataurl}${url}`, {
    mode: "cors",
    method: "POST",
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
    .then(response => response.text())
    .then(data => {
      fn(data);
    }).catch(err => {
      console.log(err);
    });
};



function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        return allText;
      }
    }
  }
  rawFile.send(null);
}