const categories = document.querySelector(".categories");
const news = document.querySelector(".news");
const body = document.querySelector("body");

const API_KEY = "e088211a-e1a7-4a14-983b-e80f6ef6e44f";
const API = `https://virtserver.swaggerhub.com/a-berezhkov/todo_app_sc_bc/1.0.0#/${API_KEY}`;

async function serverGetNew() {
  let response = await fetch("http://24api.ru/rest-news", {
    method: "GET",
  });
  let data = await response.json();
  console.log(data);

  renderNews(data);
  return data;
}

async function serverGetCats() {
  let response = await fetch("http://24api.ru/rest-news-category", {
    method: "GET",
  });
  let data = await response.json();

  renderCats(data);
}

async function serverEditNews(id, obj) {
  let response = await fetch(`http://24api.ru/rest-news/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8", // Indicates the content
    },
    body: JSON.stringify(obj),
  });
  let data = await response.json();

  serverGetNew()

  // console.log(data);
  // createOneNew(data);
}

let arrayData = await serverGetNew();
serverGetCats();

function createOneNew(obj) {
  let oneNew = document.createElement("li");
  oneNew.textContent = obj.title + " " + obj.body;
  oneNew.innerHTML = `${obj.title} ${obj.body} <button class="btn-edit"><img src="./ic/icons8-edit-100.png" alt=""></button>`;

  let editBtn = oneNew.querySelector(".btn-edit");
  editBtn.addEventListener("click", () => {
    renderPopUpEdit(obj);
    // serverEditNews(obj.id);
  });

  news.append(oneNew);
}

function renderNews(arr) {
  console.log("Data", arr);
  news.innerHTML = "";
  arr.forEach((element) => {
    createOneNew(element);
  });
}

function createOneCat(obj) {
  let oneCat = document.createElement("li");
  oneCat.textContent = obj.name;
  oneCat.addEventListener("click", () => {
    oneCat.classList.toggle("putted");
    let newArr = arrayData.filter((el) => el.body.includes(obj.name));
    renderNews(newArr);
  });
  categories.append(oneCat);
}

function renderCats(arr) {
  arr.forEach((element) => {
    createOneCat(element);
  });
  console.log(arr);
}

function renderPopUpEdit(obj) {
  console.log(obj);
  let popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<label for="newName">Название</label>
        <input type="textarea" id="newName" value=${obj.title}>
        <label for="newBody">Текст</label>
        <input type="textarea" id="newBody" value=${obj.body}>
        <button class="btn-save">Сохранить</button>`;

  let newName = popup.querySelector("#newName");
  let newBody = popup.querySelector("#newBody");

  // newBody.addEventListener("change", () => {
  //   let newValue = newBody.value;

  // });

  let saveBtn = popup.querySelector(".btn-save");
  saveBtn.addEventListener("click", () => {
    // console.log(typeof newBody.value);
    // console.log(typeof newName.value);
    let newObj = {
      title: newName.value,
      body: newBody.value,
    };

    serverEditNews(obj.id, newObj);
    popup.remove();
    renderNews();
  });

  body.append(popup);
}
