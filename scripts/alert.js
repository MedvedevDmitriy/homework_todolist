function CustomAlert(){
	this.render = function(dialog){
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var dialogOverLay = document.getElementById('dialogOverLay');
		var dialogBox = document.getElementById('dialogBox');
		dialogOverLay.style.display = "block";
		dialogOverLay.style.height = windowHeight + "px";
		dialogBox.style.left = (windowWidth / 2) - (550 * 0.5) + "px";
		dialogBox.style.top = "100px";
		dialogBox.style.display = "block";
		document.getElementById('dialogBoxHead').innerHTML = "Вот таковой вот кастомизированный Alert :)";
		document.getElementById('dialogBoxBody').innerHTML = dialog;
		document.getElementById('dialogBoxFoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
	}
	this.ok = function(){
		document.getElementById('dialogBox').style.display = "none";
		document.getElementById('dialogOverLay').style.display = "none";
	}
}
var Alert = new CustomAlert();