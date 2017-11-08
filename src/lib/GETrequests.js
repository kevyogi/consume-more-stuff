export const getCategories = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (){
    if(oReq.readyState === XMLHttpRequest.DONE && oReq.status === 200) {
      var response = JSON.parse(this.response);
      resolve(response);
    }
  };
  oReq.open("GET", "http://localhost:8080/api/categories");
  oReq.setRequestHeader('content-type', 'application/json');
  oReq.send();
})

export const getConditions = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (){
    if(oReq.readyState === XMLHttpRequest.DONE && oReq.status === 200) {
      var response = JSON.parse(this.response);
      resolve(response);
    }
  };
  oReq.open("GET", "http://localhost:8080/api/conditions");
  oReq.setRequestHeader('content-type', 'application/json');
  oReq.send();
})

export const getItems = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (){
    if(oReq.readyState === XMLHttpRequest.DONE && oReq.status === 200) {
      var response = JSON.parse(this.response);
      resolve(response);
    }
  };
  oReq.open("GET", "http://localhost:8080/api/conditions");
  oReq.setRequestHeader('content-type', 'application/json');
  oReq.send();
})

export const getStatuses = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (){
    if(oReq.readyState === XMLHttpRequest.DONE && oReq.status === 200) {
      var response = JSON.parse(this.response);
      resolve(response);
    }
  };
  oReq.open("GET", "http://localhost:8080/api/conditions");
  oReq.setRequestHeader('content-type', 'application/json');
  oReq.send();
})

export const getUsers = () => new Promise((resolve, reject) => {
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (){
    if(oReq.readyState === XMLHttpRequest.DONE && oReq.status === 200) {
      var response = JSON.parse(this.response);
      resolve(response);
    }
  };
  oReq.open("GET", "http://localhost:8080/api/conditions");
  oReq.setRequestHeader('content-type', 'application/json');
  oReq.send();
})