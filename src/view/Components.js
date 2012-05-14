var dgid = dgid || function (id) { return document.getElementById(id); };
var dgc = dgc || function (cn) { return document.getElementsByClassName(cn); };

// gather elements
var e = {};
e["main_menu"] = dgc("ag-menu");


function _hide(elems) {
	for (var i = 0, len = elems.length; i < len; i++) {
		var elemStyle = elems[i].style;
		if (elemStyle.display !== "none") {
			elemStyle.display_backup = elemStyle.display;
			elemStyle.display = "none";
		}
	}
}

function _show(elems) {
	for (var i = 0, len = elems.length; i < len; i++) {
		var elemStyle = elems[i].style;
		if (elemStyle.display === "none") {
			elemStyle.display = elemStyle.display_backup || "block";
		}
	}
}

exports.hideAll = function () {
	for (var elems in e) {
		if (e.hasOwnProperty(elems)) {
			_hide(e[elems]);
		}
	}
}

exports.hide = function (elemString) {
	e[elemString] && _hide(e[elemString]);
}

exports.show = function (elemString) {
	e[elemString] && _show(e[elemString]);
}