/////////////
// MAIN_BEGIN
document.getElementById('registration').style.display = 'none';
document.getElementById('authorization').style.display = 'none';
document.getElementById('toDoList').style.display = 'none';

var xmlHttpRequest = createRequest();
function createRequest() {
	var request;
	var browser = navigator.appName;
	if (browser == "Microsoft Internet Explorer") {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else {
		request = new XMLHttpRequest();
	}
	return request;
}

var page = localStorage.getItem('page');
var current_user = getLoggedUser();

if (current_user != null) {
	page = 'toDoList';
}
if (page === null) {
	showPageReg();
}
else {
	switch(page) {
		case "registration": showPageReg(); break;
		case "authorization": showPageAuth(); break;
		case "toDoList": showPageList(); break;
		default: localStorage.removeItem('page');
		alert("Ошибка инициализации web странницы!\n Странница будет перезапущенна.")
		refresh();
	}
}
// MAIN_END
///////////

////////////////////////////////////////////////////////////////////////////
// INITIALIZING OF THREE METHODS: REGISTRATION, SIGN IN AND TO DO LIST_BEGIN
function showPageReg() {
	document.title = 'Registration';
	var show = document.getElementById('registration');
	show.style.display = "block";

}

function showPageAuth() {
	document.title = 'Authorization';
	var show = document.getElementById('authorization');
	show.style.display = "block";
}

function showPageList() {
	document.title = 'To Do List';
	var show = document.getElementById('toDoList');
	show.style.display = "block";

	var obj = getLoggedUser();
	document.getElementById('loggedUserName').innerHTML = obj.login;

	initList(obj);
}
// INITIALIZING OF THREE METHODS: REGISTRATION, SIGN IN AND TO DO LIST_END
//////////////////////////////////////////////////////////////////////////

///////////////////////////
// ADDITIONAL METHODS_BEGIN
function changePage(page) {
	localStorage.setItem('page', page);
	refresh();
}

function refresh() {
	location.reload();
}

function getLoggedUser() {
	var string = localStorage.getItem('loggedUser');
	var user = JSON.parse(string);
	return user;
}

function setLoggedUser(user) {
	var string = JSON.stringify(user);
	localStorage.setItem('loggedUser', string);
}
// ADDITIONAL METHODS_BEGIN
///////////////////////////

//////////////////////////
// REGISTRATION PART_BEGIN
function signUp(login,email,password,password2) {
	if (xmlHttpRequest == null) {
		return alert('Нужно писать код качественно и правильно!');
	} 	
	if (login.trim() == '') {
		alert('Введите логин!');
	}
	else if (email.trim() == '') {
		alert('Введите Email!');
	}
	else if (password == '') {
		alert('Введите пароль!');
	}
	else if (password2 != password) {
		alert('Повторный пароль введён неверно');
	}		
	else {
		var nocache = 0;
		nocache = Math.random();
		var req = 'login=' + login + '&email=' + email + '&password=' + password + '&nocache=' + nocache;
		xmlHttpRequest.open('GET','php/registration.php?' + req, true);
		xmlHttpRequest.onreadystatechange = signUpReply;
		xmlHttpRequest.send();
	}
}

function signUpReply() {
	if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { 
		var response = xmlHttpRequest.responseText;
		if (response == 'login_exist') {
			alert('Введённый логин уже существует!');
		}
		else if (response == 'email_exist') {
			alert('Данный email уже принадлежит одному из зарегистрированных пользователей!');
		}
		else if (response == 'success') {
			alert('Вы успешно зарегистрированны!');
			changePage('authorization');
		} 
		else {
			alert('Регистрация прервана!');
		}
	}
}
// REGISTRATION PART_END
////////////////////////

////////////////////////////
/// AUTHORIZATION PART_BEGIN
function signIn(login,password) {
	if (xmlHttpRequest == null) {
		return alert('Нужно писать код качественно и правильно!');
	} 
	else if (login.trim() == '') {
		alert('Введите логин!');
	}
	else if (password == '') {
		alert('Введите пароль!');
	}
	else {
		var nocache = 0;
		nocache = Math.random();
		var req = 'login=' + login + '&password=' + password + '&nocache=' + nocache;
		xmlHttpRequest.open('GET', 'php/authorization.php?' + req, true);
		xmlHttpRequest.onreadystatechange = signInReply;
		xmlHttpRequest.send();
	}	
}

function signInReply() {
	if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { 
		var response = JSON.parse(xmlHttpRequest.responseText);
		if (response == '0') {
			alert('Авторизация не удалась! Проверьте правильность ввода логина и пароля!');
		} 
		else {
			setLoggedUser(response);
			changePage('toDoList');
		}
	}
}
// AUTHORIZATION PART_END
/////////////////////////

//////////////////////////////////////////////////////////////////////////
// UPDATING DATABASE WHEN USER SIGNING OUT FROM HIS TODOLIST SESSION_BEGIN
function updateBase() {
	var string = localStorage.getItem('currentList');
	var user = getLoggedUser();
	if (xmlHttpRequest == null) {
		return alert('Нужно писать код качественно и правильно!');
	} 
	else {
		var nocache = 0;
		nocache = Math.random();
		var req = 'id=' + user.id + '&data=' + string + '&nocache=' + nocache;
		xmlHttpRequest.open('GET', 'php/updatelistdata.php?' + req, true);
		xmlHttpRequest.onreadystatechange = updateBaseReply;
		xmlHttpRequest.send();
	}
}

function updateBaseReply() {
	if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { 
		var response = xmlHttpRequest.responseText;
		if (response == 'success') {
			alert('Изменения были автоматически сохранены! До новых встреч! :)');
			document.getElementById('loggedUserName').innerHTML = '';
			localStorage.removeItem('loggedUser');
			localStorage.removeItem('currentList');
			changePage('authorization')
		} 
		else {		
			alert('Ошибка при сохранении изменений: ' + response);
		}
	}
}
// UPDATING DATABASE WHEN USER SIGNING OUT FROM HIS TODOLIST SESSION_END
////////////////////////////////////////////////////////////////////////

////////////////////////////////////
// BLOCK OF METHODS TO DO LIST_BEGIN
function initList(user) {
	var list = document.querySelector('ul');
	list.addEventListener('click', function(e) {
		if (e.target.tagName === 'LI') {
			e.target.classList.toggle('checked');
		}
	}, false);

	var array = JSON.parse(localStorage.getItem('currentList'));
	if (array != null) {
		for (var i = 0; i < array.length; i++) {
			newElement(array[i].text, array[i].checked)
		}
	} 
	else if (xmlHttpRequest == null) {
		return alert('Нужно писать код качественно и правильно!');
	}  
	else {
		var nocache = 0;
		nocache = Math.random();
		var req = 'id=' + user.id + '&nocache=' + nocache;
		xmlHttpRequest.open('GET', 'php/getlistdata.php?' + req, true);
		xmlHttpRequest.onreadystatechange = initListReply;
		xmlHttpRequest.send();
	}
}

function initListReply() {
	if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) { 
		var response = xmlHttpRequest.responseText;
		if (response == '0') {
			alert('Ошибка загрузки данных! Пожалуйста перезапустите приложение');
		}
		else if (response != '') {
			var array = JSON.parse(response);
			for (var i = 0; i < array.length; i++) {
				newElement(array[i].text, array[i].checked);
			}
		}
	}
}

function newElement(value,state) {
	var li = document.createElement("li");
	li.onclick = function() {
		var array = JSON.parse(localStorage.getItem('currentList'));
		for (var i = 0; i < array.length; i++) {
			if (array[i].text == value) {
				if (array[i].checked == 'true')
					array[i].checked = 'false';
				else
					array[i].checked = 'true';
				break;
			}
		}
		localStorage.setItem('currentList',JSON.stringify(array));
	}
	var node = document.createTextNode(value);
	li.appendChild(node);

	if (value == '') {
		Alert.render('В поле для ввода текста необходимо что-нибудь написать!');
		//alert("В поле для ввода текста необходимо что-нибудь написать!");
		return;
	}
	else {
	  document.getElementById("myUL").appendChild(li);
	}
	document.getElementById("myInput").value = "";

	var buttonClose = document.createElement("BUTTON");
	var txt = document.createTextNode("\u00D7");
	buttonClose.className = "close";
	buttonClose.appendChild(txt);
	li.appendChild(buttonClose);

	if (state == 'true') {
		li.classList.add('checked');
	}

	var buttonsClose = document.getElementsByClassName("close");
	buttonsClose[buttonsClose.length - 1].onclick = function() {
		var tmp = [];
		var array = JSON.parse(localStorage.getItem('currentList'));
		for (var i = 0; i < array.length; i++) {
			if (array[i].text == value)
				continue;
			tmp.push(array[i]);
		}
		array = tmp;
		localStorage.setItem('currentList',JSON.stringify(tmp));

		var parent = this.parentElement;
		parent.style.display = 'none';
		}

	var obj = {
		text: value,
		checked: state
	}

	var array = JSON.parse(localStorage.getItem('currentList'));
	if (array != null)
		array.push(obj);
	else {
		array = [];
		array.push(obj);
	}
	localStorage.setItem('currentList',JSON.stringify(array));
}
// BLOCK OF METHODS TO DO LIST_BEGIN_END
////////////////////////////////////////