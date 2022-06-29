const loadEndFn = (result) => {
  const _result = JSON.parse(result);

  const {
    dailylifesubcategory,
    dailylife,
    maincategory,
    personal,
    specialtopicsubcategory,
    specialtopic,
  } = _result.messages.diff;

  parseCommon(dailylifesubcategory, `dailylifesubcategory`);
  parseCommon(dailylife, `dailylife`);
  parseCommon(maincategory, `maincategory`);
  parseCommon(personal, `personal`);
  parseCommon(specialtopicsubcategory, `specialtopicsubcategory`);
  parseCommon(specialtopic, `specialtopic`);
}

const parseCommon = (categoryRoot, categoryName) => {
  const categoryCName = `diff-${categoryName}`;
  const addedCName = `diff-added`;
  const updatedCName = `diff-updated`;
  const deletedCName = `diff-deleted`;

  $(".diff-result").append(`<div class="category-wrapper ${categoryCName}"><div class="category-title">category ${categoryName}</div></div>`)
  $(`.${categoryCName}`).append(`<div class="${addedCName}"><div class="added-title">Added</div><div class="added-contents">${getDiffAddedResult(categoryRoot)}</div></div>`)
  $(`.${categoryCName}`).append(`<div class="${updatedCName}"><div class="updated-title">Updated</div><div class="updated-contents">${getDiffUpdatedResult(categoryRoot)}</div></div>`)
  $(`.${categoryCName}`).append(`<div class="${deletedCName}"><div class="deleted-title">Deleted</div><div class="deleted-contents">${getDiffDeletedResult(categoryRoot)}</div></div>`)
}

const clearDiffResult = () => $(".diff-result").empty();

const getDiffAddedResult = (categoryRoot) => categoryRoot.added.join("<br>")
const getDiffUpdatedResult = (categoryRoot) => categoryRoot.updated.join("<br>");
const getDiffDeletedResult = (categoryRoot) => categoryRoot.deleted.join("<br>");

var _postData = {};

function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      const data = reader.result;
      let workBook = XLSX.read(data, { type: 'binary' });

      document.querySelector('.image-upload-wrap').style.display = 'none';
      document.querySelector('.file-upload-content').style.display = 'block';

      const _data = {};
      _data.personal = getJsonData(workBook, "personal")
      _data.maincategory = getJsonData(workBook, "maincategory")
      _data.dailylife = getJsonData(workBook, "dailylife");
      _data.dailylifesubcategory = getJsonData(workBook, "dailylifesubcategory");
      _data.specialtopic = getJsonData(workBook, "specialtopic");
      _data.specialtopicsubcategory = getJsonData(workBook, "specialtopicsubcategory");

      _postData = _data;

      _post(`/data/compare`, _data, loadEndFn);

      let imgTitles = document.querySelectorAll('.image-title');

      for (let title of imgTitles) {
        title.innerHTML = input.files[0].name;
      }
    };

    reader.readAsBinaryString(input.files[0]);

  } else {
    removeUpload();
  }
}

function editDecodeRange(sheets) {
  const range = XLSX.utils.decode_range(sheets['!ref']);
  range.s.r = 9;

  sheets['!ref'] = XLSX.utils.encode_range(range);
}

function getSheets(workbook, sheetName) {
  return workbook.Sheets[sheetName];
}

function getJsonData(workbook, sheetName) {
  const sheets = getSheets(workbook, sheetName);
  editDecodeRange(sheets);
  return XLSX.utils.sheet_to_json(sheets, { defval: "" });
}

function removeUpload() {
  document.querySelector('.file-upload-input').value = "";
  document.querySelector('.file-upload-content').style.display = 'none';
  document.querySelector('.image-upload-wrap').style.display = 'block';

  clearDiffResult();
}

document.addEventListener('DOMContentLoaded', function () {
  let imageElement = document.querySelector('.image-upload-wrap');
  let addedClass = 'image-dropping';

  imageElement.addEventListener('dragover', function () {
    imageElement.classList.add(addedClass)
  });

  imageElement.addEventListener('dragleave', function () {
    imageElement.classList.remove(addedClass)
  });
})

const uploadData = () => {
  _post("/data/update", _postData, uploadCompleted);
}

const uploadCompleted = (_result) => {
  console.log(_result);
  clearDiffResult();
}