let positions_colours = {
	trialhelper: "#d7bf4c",
	trialhelper_duplicate: "#d7bf4c",
	helper: "#dfac39",
	helper_duplicate: "#dfac39",
	trialminimod: "#ed904a",
	minimod: "#e1823b",
	minimod_duplicate: "#e1823b",
	minimod_triplicate: "#e1823b",
	mod: "#da685c",
	mod_duplicate: "#da685c",
	megamod: "#CF5050",
	guardian: "#18d0ff",
	guardian_duplicate: "#18d0ff",
	guardianmanagerhelper: "#18d0ff",
	guardianmanager: "#00b1ff",
	mentor: "#f26f93",
	mentor_duplicate: "#f26f93",
	mentormanagerhelper: "#eb6a8c",
	mentormanager: "#f2557f",
	reddit: "#4962fd",
	instagram: "#4962fd",
	facebook: "#4962fd",
	twitter: "#4962fd",
	socialmedia: "#4962fd",
	socialmediamanager: "#4962fd",
	dev: "#F1C40F",
	developer: "#F1C40F",
	moderator: "#00bfff",
	admin: "#17afbd",
	translatormanager: "#45a033",
	translatorhelper: "#6ab65c",
	translator: "#83c676",
	designer: "#834eac",
	designermanager: "#6312a2",
	designersupervisor: "#7d2dbb"
}

function adding_links() {
	link = document.getElementsByClassName('role_link')
	for (var i = 0; i < link.length; i++) {
		object_part = link[i].innerText.toLowerCase().replace(/\s/g,'');  
		if ((link[i].href=="")&&(!link[i].innerText.includes("translator"))) {
			link[i].href = "https://heroes.wolvesville.com/list?role=" + object_part
		}
		if (link[i].style.color=="") {
			link[i].style.color = positions_colours[object_part]
		}
	}
	link = document.getElementsByClassName('name_link')
	for (var i = 0; i < link.length; i++) {
		if (link[i].href=="") {
			object_part = link[i].innerText
			link[i].href = "https://heroes.wolvesville.com/list?member=" + object_part
		}
	}
}


function show_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "flex"
}
function hide_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "none"
}