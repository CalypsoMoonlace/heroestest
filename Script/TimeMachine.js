var unix_today = Math.round((new Date()).getTime()); // ajd en unix
let time_obj = new Date(unix_today); // ajd en objet
var positions = ["trialhelper", "helper", "trialminimod", "minimod", "mod", "megamod","mentormanager","reddit","instagram","facebook","twitter"];
var positions_result_text = {
	trialhelper: "Trial Helper",
	trialhelper_duplicate: "Trial Helper (for the second time)",
	helper: "Helper",
	helper_duplicate: "Helper (for the second time)",
	trialminimod: "Trial Minimod",
	minimod: "Minimod",
	minimod_duplicate: "Minimod (for the second time)",
	minimod_triplicate: "Minimod (for the third time)",
	mod: "Moderator",
	mod_duplicate: "Moderator (for the second time)",
	megamod: "Megamod",
	guardian: "Guardian",
	guardian_duplicate: "Guardian (for the second time)",
	guardianmanagerhelper: "Guardian Manager Helper",
	guardianmanager: "Guardian Manager",
	mentor: "Mentor",
	mentor_duplicate: "Mentor (for the second time)",
	mentormanagerhelper: "Mentor Manager Helper",
	mentormanager: "Mentor Manager",
	instagram: "Social media manager <img src='Pictures/instagram logo.png' class='mini_img'>",
	facebook: "Social media manager <img src='Pictures/facebook logo.png' class='mini_img'>",
	reddit: "Social media manager <img src='Pictures/reddit logo.png' class='mini_img'>",
	twitter: "Social media manager <img src='Pictures/twitter logo.png' class='mini_img'>",
	socialmedia: "Social media manager",
	dev: "Developer",
	tc_mod: "Moderator <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>",
	tc_admin: "Admin <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>",
	tc_manager: "Manager <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>"
}
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
	tc_mod: "#00bfff",
	tcadmin: "#17afbd",
	admin: "#17afbd",
	translatormanager: "#45a033",
	translatorhelper: "#6ab65c",
	translator: "#83c676",
	designer: "#834eac",
	designermanager: "#6312a2",
	designersupervisor: "#7d2dbb"
}
var position_text_index,part_of_the_object_used;
var jour,mois,year;

var ligne = {
	trialhelper: false,
	helper: false,
	trialminimod: false,
	minimod: false,
	mod: false,
	megamod: false
};
var amount_of_change,staff_member,place_to_go,time_change,time_simulation;

function loading() {
	date_reset()
}

function adding_links() {
	link = document.getElementsByClassName('role_link')
	for (var i = 0; i < link.length; i++) {
		object_part = link[i].innerText.toLowerCase().replace(/\s/g,'');
		if (link[i].innerText.includes("Moderator")) { // Sorting TC mod vs Main mod
			if (link[i].getElementsByTagName('img').length==0) {
				object_part = "mod"
			} else {
				object_part = "tc_mod"
			}
		}
		if (link[i].href=="") {
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

function date_moins(time_change) {
	time_simulation = time_simulation - time_change; // - jours en unix
	time_obj = new Date(time_simulation) // format dd/mm/yyyy etc
	jour = time_obj.getDate();
	mois = time_obj.getMonth();
	year = time_obj.getYear();
	document.getElementById("date").innerHTML = "Staff on the " + jour + "/" + (mois+1) + "/" + (year+1900);
	update();
}

function date_plus(time_change) {
	time_simulation = time_simulation + time_change; // + jours format unix
	time_obj = new Date(time_simulation)
	var jour = time_obj.getDate();
	var mois = time_obj.getMonth();
	var year = time_obj.getYear();
	document.getElementById("date").innerHTML = "Staff on the " + jour + "/" + (mois+1) + "/" + (year+1900);
	update();
}

function date_reset() { // retour à ajd
	unix_today = Math.floor(unix_today/86400000)*86400000
	time_simulation = unix_today;
	time_obj = new Date(time_simulation)
	var jour = time_obj.getDate();
	var mois = time_obj.getMonth();
	var year = time_obj.getYear(); 
	document.getElementById("date").innerHTML = "Staff on the " + jour + "/" + (mois+1) + "/" + (year+1900);
	update();
};

function date_pick() { // choose the date
	time_simulation = new Date(document.getElementById('date_pick').value).getTime()
	console.log(time_simulation);
	time_obj = new Date(time_simulation)
	console.log(time_obj);
	var jour = time_obj.getDate();
	var mois = time_obj.getMonth();
	var year = time_obj.getYear();  
	document.getElementById("date").innerHTML = "Staff on the " + jour + "/" + (mois+1) + "/" + (year+1900);
	update();
};

function update() {

	time_obj = new Date(time_simulation) // format dd/mm/yyyy etc
	jour = time_obj.getDate();
	mois = time_obj.getMonth();
	year = time_obj.getYear();
	birthday_check = jour + "/" + (mois+1); // for staff bd

	time_obj = new Date(time_simulation+86400000) // format dd/mm/yyyy etc
	jour = time_obj.getDate();
	mois = time_obj.getMonth();
	year = time_obj.getYear();
	birthday_check_2 = jour + "/" + (mois+1); // for staff bd

	if (time_simulation >= unix_today) {
		//document.getElementsByClassName('bouton_forward')[0].style.visibility = "hidden"; // remove option to further if today
		document.getElementsByClassName('bouton_forward')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_forward')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_forward')[1].style.visibility = "visible";
	};
	if (time_simulation >= unix_today-86400000*7) {
		document.getElementsByClassName('bouton_forward_week')[0].style.visibility = "hidden";
		document.getElementsByClassName('bouton_forward_week')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_forward_week')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_forward_week')[1].style.visibility = "visible";
	};
	if (time_simulation >= unix_today-86400000*30) {
		document.getElementsByClassName('bouton_forward_month')[0].style.visibility = "hidden"; 
		document.getElementsByClassName('bouton_forward_month')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_forward_month')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_forward_month')[1].style.visibility = "visible";
	};

	if (time_simulation/1000 <= 1525176656+86400) {
		document.getElementsByClassName('bouton_back')[0].style.visibility = "hidden"; // remove option to go back if 01/05/2018
		document.getElementsByClassName('bouton_back')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_back')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_back')[1].style.visibility = "visible"; // show it otherwise
	};
	if (time_simulation/1000 <= 1525176656+86400*7) {
		document.getElementsByClassName('bouton_back_week')[0].style.visibility = "hidden"; // same as above, 7d version
		document.getElementsByClassName('bouton_back_week')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_back_week')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_back_week')[1].style.visibility = "visible";
	}
	if (time_simulation/1000 <= 1525176656+86400*30) {
		document.getElementsByClassName('bouton_back_month')[0].style.visibility = "hidden";
		document.getElementsByClassName('bouton_back_month')[1].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('bouton_back_month')[0].style.visibility = "visible"; 
		document.getElementsByClassName('bouton_back_month')[1].style.visibility = "visible";
	};
	//if (time_simulation/1000 < 1532261456) {
	//	document.getElementById('ancienne').style.overflow = "auto";
	//} else {
	//	document.getElementById('ancienne').style.overflow = "visible";
	//}

	for (var i = 0; i < document.getElementsByClassName('rang').length; i++) { // Resetting all the list
		BigDiv = document.getElementsByClassName('rang')[i]
		requiredDiv = BigDiv.getElementsByTagName('div')[1];
		requiredDiv.innerHTML = null;
	}
	document.getElementsByClassName('events_log')[0].innerHTML = null;
	document.getElementsByClassName('events_log')[1].innerHTML = null;

	if (time_simulation/1000<1530183429) {
		document.getElementById('guardianmanager').innerHTML = "The guardian system didn't exist back then";
		document.getElementsByClassName('guardian_manager_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('guardian_titre')[0].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('guardian_manager_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('guardian_titre')[0].style.visibility = "visible";
	}
	if (time_simulation/1000<1604828950) { // gmh was created later
		document.getElementsByClassName('guardian_manager_helper_titre')[0].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('guardian_manager_helper_titre')[0].style.visibility = "visible";
	}
	if (time_simulation/1000<1528823110) {
		document.getElementById('mentor').innerHTML = "The mentor system didn't exist back then";
		document.getElementsByClassName('mentor_manager_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('mentor_titre')[0].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('mentor_manager_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('mentor_titre')[0].style.visibility = "visible";
	}
	if (time_simulation/1000<1539594154) {
		document.getElementById('reddit').innerHTML = "The social media manager system didn't exist back then";
		document.getElementsByClassName('reddit_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('instagram_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('twitter_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('facebook_titre')[0].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('reddit_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('instagram_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('twitter_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('facebook_titre')[0].style.visibility = "visible";
	}
	if (time_simulation/1000<1530266451) {
		document.getElementById('tc_admin').innerHTML = "Tester Club didn't exist back then";
		document.getElementsByClassName('tc_admin_titre')[0].style.visibility = "hidden";
		document.getElementsByClassName('tc_mod_titre')[0].style.visibility = "hidden";
	} else {
		document.getElementsByClassName('tc_admin_titre')[0].style.visibility = "visible";
		document.getElementsByClassName('tc_mod_titre')[0].style.visibility = "visible";
	}

	for (var i = 0; i < Object.keys(staff_birthdays).length; i++) {
		staff_member = Object.keys(staff_birthdays)[i]
		if ((staff_birthdays[staff_member] == birthday_check)&&(staff_member!="WWO")) {
			result = "It is <a class='name_link'>" + staff_member + "</a>'s birthday today!"
			document.getElementsByClassName('events_log')[0].innerHTML+= result + "<br>"
		}
		if ((staff_birthdays[staff_member] == birthday_check_2)&&(staff_member!="WWO")) {
			result = "It is <a class='name_link'>" + staff_member + "</a>'s birthday tomorrow!"
			document.getElementsByClassName('events_log')[1].innerHTML+= result + "<br>"
		}
		if ((staff_birthdays[staff_member] == birthday_check)&&(staff_member=="WWO")) {
			result = "It is " + staff_member + "'s birthday today!"
			document.getElementsByClassName('events_log')[0].innerHTML+= "<span style='color: #4287f5; font-weight: bold;'>" + result + "</span><br>"
		}
		if ((staff_birthdays[staff_member] == birthday_check_2)&&(staff_member=="WWO")) {
			result = "It is " + staff_member + "'s birthday tomorrow!"
			document.getElementsByClassName('events_log')[1].innerHTML+= "<span style='color: #4287f5; font-weight: bold;'>" + result + "</span><br>"
		}
	}
	for (var i = 0; i < Object.keys(other_dates).length; i+=2) {
		special_date = Object.keys(other_dates)[i]
		if ((time_simulation/1000 < other_dates[special_date])&&(other_dates[special_date] < time_simulation/1000+86400)) {
			special_date = Object.keys(other_dates)[i+1]
			result = other_dates[special_date]
			document.getElementsByClassName('events_log')[0].innerHTML+= "<span style='color: yellow'>" + result + "</span><br>";
		}
		if ((time_simulation/1000+86400 < other_dates[special_date])&&(other_dates[special_date] < time_simulation/1000+86400*2)) {
			special_date = Object.keys(other_dates)[i+1]
			result = other_dates[special_date];
			document.getElementsByClassName('events_log')[1].innerHTML+= "<span style='color: yellow'>" + result + "</span><br>";
		}
	}

	for (var j = 0; j < whole_staff_list.length - 1; j++) { // -1 because no dev list!
		for (var i = 0; i < whole_staff_list[j].length; i++) {
			staff_member = whole_staff_list[j][i];
			//console.log(i); for tests
			amount_of_change = Object.keys(whole_staff_list[j][i]).length; // amount of time the staff member changed status 
			for (part_of_the_object_used = 2; part_of_the_object_used < amount_of_change; part_of_the_object_used++) { // for loop so it checks every 'status' (starts at 2 bc of "current status" & 'name') // note: doesn't include "id"
				
				if (((time_simulation/1000)-31622400 < staff_member[Object.keys(staff_member)[part_of_the_object_used]]) // event anniversary thing
					&& ((time_simulation/1000)-31622400+86400 > staff_member[Object.keys(staff_member)[part_of_the_object_used]])) {
					if ((Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff")||(Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff_duplicate")) {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used-1]
						result =  "One year ago, <a class='name_link'>" + staff_member.name + "</a> no longer was a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					} else {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used]
						result =  "One year ago, <a class='name_link'>" + staff_member.name + "</a> became <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					}
					document.getElementsByClassName('events_log')[0].innerHTML += "<p>" + result + "</p>" // adding text
					document.getElementsByClassName('events_log')[0].lastChild.lastChild.href = "https://heroes.wolvesville.com/list?role=" + position_text_index // adding link
				}
				if (((time_simulation/1000)-31622400*2 < staff_member[Object.keys(staff_member)[part_of_the_object_used]])
					&& ((time_simulation/1000)-31622400*2+86400 > staff_member[Object.keys(staff_member)[part_of_the_object_used]])) {
					if ((Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff")||(Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff_duplicate")) {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used-1]
						result =  "Two years ago, <a class='name_link'>" + staff_member.name + "</a> no longer was a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					} else {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used]
						result =  "Two years ago, <a class='name_link'>" + staff_member.name + "</a> became a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					}
					document.getElementsByClassName('events_log')[0].innerHTML += "<p>" + result + "</p>"
					document.getElementsByClassName('events_log')[0].lastChild.lastChild.href = "https://heroes.wolvesville.com/list?role=" + position_text_index
				}
				if (((time_simulation/1000)-31622400+86400 < staff_member[Object.keys(staff_member)[part_of_the_object_used]]) // event anniversary thing
					&& ((time_simulation/1000)-31622400+86400*2  > staff_member[Object.keys(staff_member)[part_of_the_object_used]])) {
					if ((Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff")||(Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff_duplicate")) {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used-1]
						result =  "It'll be one year since <a class='name_link'>" + staff_member.name + "</a> no longer was a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					} else {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used]
						result =  "It'll be one year since <a class='name_link'>" + staff_member.name + "</a> became a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					}
					document.getElementsByClassName('events_log')[1].innerHTML += "<p>" + result + "</p>" 
					document.getElementsByClassName('events_log')[1].lastChild.lastChild.href = "https://heroes.wolvesville.com/list?role=" + position_text_index
				}
				if (((time_simulation/1000)-31622400*2+86400 < staff_member[Object.keys(staff_member)[part_of_the_object_used]])
					&& ((time_simulation/1000)-31622400*2+86400*2  > staff_member[Object.keys(staff_member)[part_of_the_object_used]])) {
					if ((Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff")||(Object.keys(staff_member)[part_of_the_object_used]=="no_more_staff_duplicate")) {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used-1]
						result =  "It'll be two years since <a class='name_link'>" + staff_member.name + "</a> no longer was <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					} else {
						position_text_index = Object.keys(staff_member)[part_of_the_object_used]
						result =  "It'll be two years since <a class='name_link'>" + staff_member.name + "</a> became a <a class='role_link'>" + positions_result_text[position_text_index] + "</a>"
					}
					document.getElementsByClassName('events_log')[1].innerHTML += "<p>" + result + "</p>"
					document.getElementsByClassName('events_log')[1].lastChild.lastChild.href = "https://heroes.wolvesville.com/list?role=" + position_text_index
				}


				if (staff_member[Object.keys(staff_member)[part_of_the_object_used]] < time_simulation/1000 
				&& (time_simulation/1000 < staff_member[Object.keys(staff_member)[part_of_the_object_used+1]] || staff_member[Object.keys(staff_member)[part_of_the_object_used+1]] == undefined)) { // checking status
					result = staff_member.name + " is " + Object.keys(staff_member)[part_of_the_object_used];
					//console.log(result)
					if (Object.keys(staff_member)[part_of_the_object_used]!="no_more_staff" && Object.keys(staff_member)[part_of_the_object_used]!="no_more_staff_duplicate") { // deal with duplicate
						place_to_go = Object.keys(staff_member)[part_of_the_object_used]
						if (Object.keys(staff_member)[part_of_the_object_used].includes("licate")) {
							if (Object.keys(staff_member)[part_of_the_object_used]=="trialhelper_duplicate") {
								place_to_go = "trialhelper";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="helper_duplicate") {
								place_to_go = "helper";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="minimod_duplicate") {
								place_to_go = "minimod";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="minimod_triplicate") {
								place_to_go = "minimod";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="mod_duplicate") {
								place_to_go = "mod";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="mentor_duplicate") {
								place_to_go = "mentor";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="guardian_duplicate") {
								place_to_go = "guardian";
							}
							if (Object.keys(staff_member)[part_of_the_object_used]=="instagram_duplicate") {
								place_to_go = "instagram";
							}
						}
						// Important debugging place
						//console.log(staff_member.name)
						//console.log(place_to_go)
						link = document.createElement('a')
						link.innerHTML = staff_member.name + "<br>"
						link.classList = "name_link"
						link.href = "https://heroes.wolvesville.com/list?member=" + staff_member.name
						document.getElementById(place_to_go).append(link)
					}
				}
			}
		}
		for (var i = 0; i < Object.keys(positions).length; i++) { // checking if the position is unused
			if (document.getElementById(positions[i]).innerHTML==null || document.getElementById(positions[i]).innerHTML=="") {
				document.getElementById(positions[i]).parentElement.style.display = "none"; // hides it if empty
				result = positions[i] + " is hidden";
				// console.log(result) not needed for now, only during tests
			} else {
			document.getElementById(positions[i]).parentElement.style.display = "block"; // shows it if used
			result = positions[i] + " is visible";
			// console.log(result) not needed for now, only during tests
			}
		}
	}

	if (document.getElementsByClassName('events_log')[0].innerHTML == "") {
		document.getElementsByClassName('events_log')[0].innerHTML = "No special event recorded for this day"
	}
	if (document.getElementsByClassName('events_log')[1].innerHTML == "") {
		document.getElementsByClassName('events_log')[1].innerHTML = "No special event recorded for tomorrow"
	}
	adding_links()
}

function show_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "flex"
}
function hide_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "none"
}