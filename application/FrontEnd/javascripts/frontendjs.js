/**
 * Class: CSC-648-03 Fall 2021
 * Name: Team5
 * Members:Stephanie Gong, Ives-Christian “Jay” Jadman, Ryan Ta
 * Douglas Hurtado, Suraj Bajgain, Robert Franz
 * File Name: frontendjs.js
 * Description: this file handles all the functionality for the front end.
 * ie. flash messaging and front end search functionality.
 */

//Only executeSearch function that matters

function Back() {
  window.history.back();
}

function setFlashMessageFadeOut(flashMessageElement) {
  setTimeout(() => {
    let currentOpacity = 1.0;
    let timer = setInterval(() => {
      if (currentOpacity < 0.05) {
        clearInterval(timer);
        flashMessageElement.remove();
      }
      currentOpacity = currentOpacity - .05;
      flashMessageElement.style.opacity = currentOpacity;
    }, 50);
  }, 4000);
}

function addFlashFromFrontEnd(message) {
  let flashMessageDiv = document.createElement('div');
  let innerFlashDiv = document.createElement('div');
  let innerTextNode = document.createTextNode(message);
  innerFlashDiv.appendChild(innerTextNode);
  flashMessageDiv.appendChild(innerFlashDiv);
  flashMessageDiv.setAttribute('id', 'flash-message');
  innerFlashDiv.setAttribute('class', 'alert alert-info');
  document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
  setFlashMessageFadeOut(flashMessageDiv);
}

async function AddMessage() {
  try {
    //gets the value of who the message is to from the url
    const message = document.querySelector('#checkmessage')
    const params = new URLSearchParams(window.location.search);
    let to;
    for (const val of params.values()){
      to = val.toString();
    }

    if (message.value.trim().length) {
      //console.log("🚀 ~ file: layout.hbs ~ line 54 ~ AddMessage ~ message.value", message.value)
      await fetch('/messages/add', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message.value, to_username: to })
      })
      message.value = ''
    }
  } catch (error) {
    console.log(error)
  }
}

function createCard(postData) {
  return `
    <div class="row">
      <div class="col-sm text-center"></div>
      <div class="col-lg">
        <br>
        <div class="card" style="">
          <img class="card-image" style="width: 200px; height: 200px; object-fit: contain; margin: auto;" src="Assets/uploads/${postData.Thumbnail}" alt="Missing Image">
          <h1 class="card-title" style="color: white;">${postData.Name}</h1>
          <h4 class="card-title" style="color: white;">${postData.ListingTittle}</h4>
          <h4 class="card-title" style="color: white;">$${postData.ListingPrice}</h4>
          <h4 class="card-text" style="color: white;">${postData.ListingDescription}</h4>
          <h4 class="card-text" style="color: white;">${postData.Availability}</h4>
          <div class="button-wrapper" style="margin: auto;">
            <input type="button" style="width: 200px;" class="btn btn-outline-dark card-button" onclick="window.location.href = '/Profile/${postData.UserName}';" value="Profile" ">
            <input type="button" style="width: 200px;" class="btn btn-outline-dark card-button" onclick="window.location.href = '/Message?to=${postData.UserName}';" value="Contact Me" ">
          </div>
        </div>
        <br><br>
      </div>
      <div class="col-sm text-center"></div>
    </div>`;
}

/**handles search funciton for the front end */
function executeSearch() {
  if(window.location.pathname != '/'){
    let searchTerm = document.getElementById('search-text').value.replace(/[^a-zA-Z ]/g, "");
    console.log(searchTerm);
    let searchTable = document.getElementById('test').value;

    $('#content').replaceWith('<div id="main-content">' + '</div>');
    let mainContent = document = document.getElementById('main-content');
    let searchURL = `/VPResults?search=${searchTerm}&from=${searchTable}`;

    fetch(searchURL)
      .then((data) => {
        return data.json();
      })
      .then((data_json) => {
        let newMainContentHTML = '';
        data_json.results.forEach((row) => {
          newMainContentHTML += createCard(row);
        });
        mainContent.innerHTML = newMainContentHTML;
        if (data_json.message) {
          addFlashFromFrontEnd(data_json.message);
        }
      })
      .catch((err) => console.log(err))
    }
  else {
    let searchTerm = document.getElementById('search-text').value.replace(/[^a-zA-Z ]/g, "");
    let searchTable = document.getElementById('test').value;

    if(document.getElementById("AboutUs")){
      var delmsg = document.getElementById("AboutUs"); //delete AboutUs Message
      delmsg.remove();
    }
    

    let mainContent = document = document.getElementById('main-content');
    let searchURL = `/VPResults?search=${searchTerm}&from=${searchTable}`;

    fetch(searchURL)
      .then((data) => {
        return data.json();
      })
      .then((data_json) => {
        let newMainContentHTML = '';
        data_json.results.forEach((row) => {
          newMainContentHTML += createCard(row);
        });
        mainContent.innerHTML = newMainContentHTML;
        if (data_json.message) {
          addFlashFromFrontEnd(data_json.message);
        }
      })
      .catch((err) => console.log(err))
  }
}

let flashElement = document.getElementById('flash-message');
if (flashElement) {
  setFlashMessageFadeOut(flashElement);
}


let searchButton = document.getElementById('search-button');
if (searchButton) {
  searchButton.onclick = executeSearch;
}

function checkPasswords() {
  p1 = document.getElementById("password").value;
  p2 = document.getElementById("cpassword").value;

  if (p1 != p2) {
    alert("Passwords don't match")
    return false;
  } else {
    return true;
  }
}

function checkEmail() {
  user = document.getElementById("email").value;
  if (user.endsWith("sfsu.edu")) {
    return true;
  } else {
    alert("Must have an SFSU email to sign up");
    return false;
  }
}

function performChecks() {
  if (checkPasswords() == true && checkEmail() == true) {
    document.getElementById("register-form").submit();
  } else {
    return false;
  }
}