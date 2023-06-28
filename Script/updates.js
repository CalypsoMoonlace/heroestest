let unix_today = Math.round((new Date()).getTime()); // ajd en unix
let time_obj = new Date(unix_today); // ajd en objet
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
let discord_positions = {
	trialhelper: true, 
	helper: true, 
	trialminimod: true, 
	minimod: true, 
	mod: true,
	megamod: true,
	instagram: false,
	facebook: false,
	reddit: false,
	twitter: false
};

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
	//wwc_dev: "#F1C40F",
	moderator: "#00bfff",
	tc_mod: "#00bfff",
	tc_admin: "#17afbd",
	admin: "#17afbd"
	//tc_manager: "#7289DA"
}
let positions_result_text = {
	trialhelper: "Trial Helper",
	trialhelper_duplicate: "Trial Helper",
	helper: "Helper",
	helper_duplicate: "Helper",
	trialminimod: "Trial Minimod",
	minimod: "Minimod",
	minimod_duplicate: "Minimod",
	minimod_triplicate: "Minimod",
	mod: "Mod",
	mod_duplicate: "Mod",
	megamod: "Megamod",
	guardian: "Guardian",
	guardian_duplicate: "Guardian",
	guardianmanagerhelper: "Guardian Manager Helper",
	guardianmanager: "Guardian Manager",
	mentor: "Mentor",
	mentor_duplicate: "Mentor",
	mentormanagerhelper: "Mentor Manager Helper",
	mentormanager: "Mentor Manager",
	instagram: "Social media manager <img src='Pictures/instagram logo.png' class='mini_img'>",
	instagram_duplicate: "Social media manager <img src='Pictures/instagram logo.png' class='mini_img'>",
	facebook: "Social media manager <img src='Pictures/facebook logo.png' class='mini_img'>",
	reddit: "Social media manager <img src='Pictures/reddit logo.png' class='mini_img'>",
	twitter: "Social media manager <img src='Pictures/twitter logo.png' class='mini_img'>",
	socialmedia: "Social media manager",
	dev: "Developer",
	//wwc_dev: "Developer of WWC",
	tc_mod: "Moderator <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>",
	tc_admin: "Admin <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>",
	tc_manager: "Manager <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>"
}
let position_text_index,object_part;
let ligne = {
	trialhelper: false,
	helper: false,
	trialminimod: false,
	minimod: false,
	mod: false,
	megamod: false
};
let page_url,staff_member,amount_of_updates,all_member_positions,team_to_load;
let all_action_text= [],all_action_unix = [];
let linkfix = {
	trialhelper_duplicate: "trialhelper",
	helper_duplicate: "helper",
	minimod_duplicate: "minimod",
	minimod_triplicate: "minimod",
	mod_duplicate: "mod",
	mentor_duplicate: "mentor",
	guardian_duplicate: "guardian",
	socialmediamanager: "socialmedia",
	instagram_duplicate: "instagram",
	moderator: "tc_mod",
	admin: "tc_admin",
	developer: "dev"
}


function loading() {
	// WINDOW SIZE
	let vh = window.innerHeight * 0.01; // on load
	document.documentElement.style.setProperty('--vh', `${vh}px`); // "--vh" = css variable, "vh" = js variable
	window.addEventListener('resize', () => { // on resize, dynamic resize
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`); 
	});
	page_url = new URLSearchParams(window.location.search);
	if (Number(page_url.get('loading'))>0) {
		updates_to_load = Number(page_url.get('loading'))
	} else {
		updates_to_load = 30
	}
	if ((Number(page_url.get('team'))<6)&&(page_url.get('team')!=null)) {
		team_to_load = Number(page_url.get('team'))
	}
	// ADDING RANDOM BUTTON
	let random_list = []
	let random_obj = {} // To avoid double entries
	for (var i = whole_staff_list.length - 1; i >= 0; i--) {
		for (var j = whole_staff_list[i].length - 1; j >= 0; j--) {
			staff_member = whole_staff_list[i][j]
			if (random_obj[staff_member.name] != true) {
				random_list[random_list.length] = staff_member
				random_obj[staff_member.name] = true
			}
		}
	}
	document.getElementsByClassName('bottom_button')[1].href = "?member=" + random_list[Math.floor(Math.random()*random_list.length)].name
	// SORTING ALL UPDATES
	sort_updates(updates_to_load,team_to_load)
	update_ready = SortingArrays(all_action_unix,all_action_text)
	// FILLING THE PAGE
	time_obj = new Date(all_action_unix[all_action_unix.length - 1]*1000) // format dd/mm/yyyy etc
	day = time_obj.getDate();
	month = months[time_obj.getMonth()];
	year = time_obj.getYear() + 1900;
	document.getElementsByClassName('rang')[0].innerHTML += "<br><h4>" + day + " "+ month + " " + year + "</h4>"
	for (var i = 1;((i <= updates_to_load)&&(i<=all_action_unix.length)); i++) {
		document.getElementsByClassName('rang')[0].innerHTML += update_ready[update_ready.length - i] + "<br>"
		if ((all_action_unix[all_action_unix.length - i]-86400/2>all_action_unix[all_action_unix.length - 1 - i])&&(i<updates_to_load)) {
			time_obj = new Date(all_action_unix[all_action_unix.length - 1 - i]*1000) // format dd/mm/yyyy etc
			day = time_obj.getDate();
			month = months[time_obj.getMonth()];
			year = time_obj.getYear() + 1900;
			document.getElementsByClassName('rang')[0].innerHTML += "<br><h4>" + day + " "+ month + " " + year + "</h4>"
		}
	}
	adding_links()
	amount_of_updates = updates_to_load;
}

function sort_updates(updates_to_load,team_to_load) {
	if (team_to_load!=undefined) {
		console.log(team_to_load)
		for (var j = team_to_load; j < team_to_load+1; j++) {
			for (var k = 0; k < whole_staff_list[j].length; k++) { // for all staff members
				staff_member = whole_staff_list[j][k]
				all_member_positions = Object.keys(staff_member) // creating an array of all updates of said staff member
				for (var m = 2; m < all_member_positions.length; m++) {
					if (all_member_positions[m]!="id") { // some start at m = 3
						if (positions_result_text[all_member_positions[m-1]]!=undefined) { // If they were staff before update
							if (all_member_positions[m].includes('no_more_staff')) { // If they left staff
								all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name + "</a> no longer was <a class=role_link>"+ positions_result_text[all_member_positions[m-1]]]+"</a>" 
							} else {
								all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name +"</a> went from <a class=role_link>"+positions_result_text[all_member_positions[m-1]]+"</a> to <a class=role_link>"+positions_result_text[all_member_positions[m]]]+"</a>" 
							}
						} else {
							all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name+"</a> became <a class=role_link>"+positions_result_text[all_member_positions[m]]] +"</a>"
						}
						all_action_unix[all_action_unix.length] = staff_member[all_member_positions[m]]
					}
				}
			}
		}
	} else {
		for (var j = 0; j < whole_staff_list.length; j++) {
			for (var k = 0; k < whole_staff_list[j].length; k++) { // for all staff members
				staff_member = whole_staff_list[j][k]
				all_member_positions = Object.keys(staff_member) // creating an array of all updates of said staff member
				for (var m = 2; m < all_member_positions.length; m++) {
					if (all_member_positions[m]!="id") { // some start at m = 3
						if (positions_result_text[all_member_positions[m-1]]!=undefined) { // If they were staff before update
							if (all_member_positions[m].includes('no_more_staff')) { // If they left staff
								all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name + "</a> no longer was <a class=role_link>"+ positions_result_text[all_member_positions[m-1]]]+"</a>" 
							} else {
								all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name +"</a> went from <a class=role_link>"+positions_result_text[all_member_positions[m-1]]+"</a> to <a class=role_link>"+positions_result_text[all_member_positions[m]]]+"</a>" 
							}
						} else {
							all_action_text[all_action_text.length] = "<a class=name_link>" + [staff_member.name+"</a> became <a class=role_link>"+positions_result_text[all_member_positions[m]]] +"</a>"
						}
						all_action_unix[all_action_unix.length] = staff_member[all_member_positions[m]]
					}
				}
			}
		}
	}
	//((all_member_positions[m]=="trialminimod")||(all_member_positions[m]=="minimod")||(all_member_positions[m]=="trialminimod")(all_member_positions[m-1]=="minimod"))
}

function SortingArrays(sorter,array_to_sort) {
	intermediate_array = []
	sorted_array = []
	for (var i = 0; i < sorter.length; i++) {
		intermediate_array[i] = [sorter[i],array_to_sort[i]]
	}
	sorter.sort()
	for (var i = 0; i < intermediate_array.length; i++) {
		for (var j = 0; j < sorter.length; j++) {
			if ((intermediate_array[i][0] == sorter[j])&&(sorted_array[j]==undefined)) { // second condition is in case there are several updates at same date
				sorted_array[j] = intermediate_array[i][1]
				j = sorter.length // just for performance
			}
		}
	}
	return sorted_array
}

function adding_links() {
	link = document.getElementsByClassName('role_link')
	for (var i = 0; i < link.length; i++) {
		object_part = link[i].innerText.toLowerCase().replace(/\s/g,'');  
		if ((link[i].href=="")&&(linkfix[object_part]===undefined)) {
			link[i].href = "https://heroes.wolvesville.com/list?role=" + object_part
		}
		if (linkfix[object_part]!=undefined) {
			link[i].href = "https://heroes.wolvesville.com/list?role=" + linkfix[object_part]
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

function show_more() {
	time_obj = new Date(all_action_unix[all_action_unix.length - amount_of_updates]*1000) // format dd/mm/yyyy etc
	for (var i = amount_of_updates+1;((i <= amount_of_updates+50)&&(i<=all_action_unix.length)); i++) {
		document.getElementsByClassName('rang')[0].innerHTML += update_ready[update_ready.length - i] + "<br>"
		if ((all_action_unix[all_action_unix.length - i]-86400/2>all_action_unix[all_action_unix.length - 1 - i])&&(i<amount_of_updates+50)) {
			time_obj = new Date(all_action_unix[all_action_unix.length - 1 - i]*1000) // format dd/mm/yyyy etc
			day = time_obj.getDate();
			month = months[time_obj.getMonth()];
			year = time_obj.getYear() + 1900;
			document.getElementsByClassName('rang')[0].innerHTML += "<br><h4>" + day + " "+ month + " " + year + "</h4>"
		}
	}
	amount_of_updates += 50;
	adding_links()
}

function show_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "flex"
}
function hide_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "none"
}