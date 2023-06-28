let unix_today = Math.round((new Date()).getTime()); // ajd en unix
let time_obj = new Date(unix_today); // ajd en objet
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
let discord_positions = { // I honestly forgot what this does. Should be something related to not showing the positions above.
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
let max_years = 0; // "years of service"
let years_to_text = ["a year","2 years","3 years"]

let positions_explanation = {
	trialhelper: 'A <a class="role_link">helper<a> over time with the same rights as a <a class="role_link">helper<a> to prove that they can be a good <a class="role_link">helper<a>.<br><br> After a few days, higher ranked staff members will decide whether this person becomes a normal <a class="role_link">helper<a> or not. <br><br> Applications for trial helpers are sometimes opened in <span style="color: #7289da">#discord-announcements.</span>',
	helper: 'Helpers are users who have passed the <a class="role_link">trial helper<a> phase. Helpers take care of <span style="color: #7289da">#feedback, #bugs</span> and <span style="color: #7289da">#questions</span>. They help keeping the server a clean and safe place.',
	trialminimod: 'A <a class="role_link">minimod<a> over time with the same rights as a <a class="role_link">minimod<a> to prove that they can be a good <a class="role_link">minimod<a>.<br><br> After a few days, higher ranked staff members will decide whether this person becomes a normal <a class="role_link">minimod<a> or not.',
	minimod: 'Minimods are users who have passed the <a class="role_link">trial minimod<a> phase. Minimods have the same tasks as <a class="role_link">helper<a> but can also take care of misbehaving users.<br><br>They also handle submissions for <span style="color: #7289da">#vote.</span>',
	mod: 'Moderators can ban users from the discord. They manage the staff team and events.<br><br>They also take care of most <a href="http://bit.ly/RewardsGuideline" class="yellow" target="_blank">badges<a> and some game-related topics.',
	megamod: 'They are the admins of the server. They manage all staff and focus on things such as rules, bans from the server, and other related topics. Megamod is the highest rank in staff and also the hardest one to get.',
	guardian: 'Guardians take care of ingame reports and bans. They also handle GuardianChat tickets.<br><br>All guardians are over 18, speak english and never had any ingame ban.<br><br>Guardians are picked by the <a class="role_link">guardian manager<a> and <a class="role_link">guardian manager helper<a>.',
	guardianmanagerhelper: 'The guardian manager helpers handles <a class="role_link">guardian<a>-related reports.<br><br>They help the <a class="role_link">guardian manager<a> manage the <a class="role_link">guardian<a> team.',
	guardianmanager: 'The guardian manager handles <a class="role_link">guardian<a>-related reports.<br><br>They manage the team and decide if it is necessary to open <a class="role_link">guardian<a> applications.',
	mentor: 'Mentors answer game-related questions via mentor chat. This is via another platform than discord.<br><br>All mentors are over 18 and speak english.<br><br>Mentors are picked by the <a class="role_link">mentor manager<a> and <a class="role_link">mentor manager helper<a>',
	mentormanagerhelper: 'The mentor manager helpers handles <a class="role_link">mentor<a>-related reports.<br><br>They help the <a class="role_link">mentor manager<a> manage the <a class="role_link">mentor<a> team.',
	mentormanager: 'The mentor managers handle the <a class="role_link">mentor<a> team and take care of more aspects of it.<br><br>They manage the team and decide if it is necessary to open <a class="role_link">mentor<a> applications.',
	socialmedia: 'Each social media manager handles one of the official account/platform on <a class="role_link">twitter<a>, <a class="role_link">reddit<a>, <a class="role_link">instagram<a> or <a class="role_link">facebook<a>',
	twitter: 'They take care of the official <a href="https://twitter.com/wolvesville_app" target="_blank" class="yellow">twitter<a> account.',
	facebook: 'They take care of the official <a href="https://www.facebook.com/wolvesville.wov/" target="_blank" class="yellow">facebook<a> account.',
	instagram: 'They take care of the official <a href="https://www.instagram.com/wolvesville.wov/" target="_blank" class="yellow">instagram<a> account.',
	reddit: 'They take care of the official <a href="https://www.reddit.com/r/werewolfonline/" target="_blank" class="yellow">subreddit<a>.',
	dev: 'The game!<br><br>They are ones behind all new features and evil bugs, if they\'re not busy looking for squids.',
	tc_mod: 'They handle tests of weird and funky scenarios in the <a href="https://discord.gg/SDujygY" target="_blank" class="yellow">Tester Club</a> sideserver and the server in itself.',
	tc_admin: 'They take care of the <a href="https://discord.gg/SDujygY" target="_blank" class="yellow">Tester Club</a> sideserver with almost all permissions.'
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
	instagram_duplicate: "#4962fd",
	facebook: "#4962fd",
	twitter: "#4962fd",
	socialmedia: "#4962fd",
	dev: "#F1C40F",
	tc_mod: "#00bfff",
	tc_admin: "#17afbd"
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
	mod: "Moderator",
	mod_duplicate: "Moderator",
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
let page_url,member_name,role_name,staff_member,fetching_flag_name;
let duplicate_link_fix = {
	trialhelper_duplicate: "trialhelper",
	helper_duplicate: "helper",
	minimod_duplicate: "minimod",
	minimod_triplicate: "minimod",
	mod_duplicate: "mod",
	mentor_duplicate: "mentor",
	guardian_duplicate: "guardian",
	instagram_duplicate: "instagram"
}

let text_to_flag = { // use https://github.com/twitter/twemoji/tree/master/assets/72x72 and lookup the unicode of the flag
	Albanian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e6-1f1f1.png",
	Arabic: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ef-1f1f4.png",
	Azerbaijan: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e6-1f1ff.png",
	Canadian: "https://twemoji.maxcdn.com/v/13.0.1/72x72/1f1e8-1f1e6.png",
	Chinese: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e8-1f1f3.png",
	Czech: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e8-1f1ff.png",
	Danish: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e9-1f1f0.png",
	Dutch: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f3-1f1f1.png",
	Finnish: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1eb-1f1ee.png",
	Filipino: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f5-1f1ed.png",
	French: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1eb-1f1f7.png",
	English: "https://www.wolvesville.com/static/media/flag_en.72a22873.svg", // mix from GB and american flag, to avoid cultural issues
	German: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e9-1f1ea.png",
	Greek: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ec-1f1f7.png",
	Hindi: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ee-1f1f3.png",
	Indonesian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ee-1f1e9.png",
	Hungarian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ed-1f1fa.png",
	Hebrew: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ee-1f1f1.png",
	Italian: "https://twemoji.maxcdn.com/v/13.0.1/72x72/1f1ee-1f1f9.png",
	Lithuanian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f1-1f1f9.png",
	Macedonian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f2-1f1f0.png",
	Malay: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f2-1f1fe.png",
	Portuguese: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f5-1f1f9.png",
	Portuguese_br: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1e7-1f1f7.png",
	Russian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f7-1f1fa.png",
	Romanian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f7-1f1f4.png",
	Spanish: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1ea-1f1e6.png",
	Slovenian: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f8-1f1ee.png",
	Slovak: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f8-1f1f0.png",
	Swedish: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1f8-1f1ea.png",
	Thai: "https://twemoji.maxcdn.com/v/13.0.1/72x72/1f1f1-1f1e6.png",
	Turkish: "https://twemoji.maxcdn.com/v/13.0.1/72x72/1f1f9-1f1f7.png",
	Ukrainian: "https://twemoji.maxcdn.com/v/13.0.1/72x72/1f1fa-1f1e6.png",
	Vietnamese: "https://twemoji.maxcdn.com/v/13.1.0/72x72/1f1fb-1f1f3.png"
}

function loading() {
	// WINDOW SIZE
	let vh = window.innerHeight * 0.01; // on load
	document.documentElement.style.setProperty('--vh', `${vh}px`); // "--vh" = css variable, "vh" = js variable
	window.addEventListener('resize', () => { // on resize, dynamic resize
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`); 
	});
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
	document.getElementsByClassName('bottom_button')[2].href = "?member=" + random_list[Math.floor(Math.random()*random_list.length)].name
	// FILLING PAGE
	page_url = new URLSearchParams(window.location.search);
	member_name = page_url.get('member');
	role_name = page_url.get('role')
	language_parameter = page_url.get('language');
	sort_type = page_url.get('sort');
	member_is_found = false
	role_is_found = false
	if (language_parameter=="English") {
		language_parameter = undefined // Bug proofing
	}
	if (language_parameter!=undefined) { // making it case insensitive
		language_parameter = language_parameter.substring(0,1).toUpperCase() + page_url.get('language').substring(1).toLowerCase()
	}
	if ((member_name!=null)&&(role_name!=null)) {
		role_name = null
		// member has priority over role, to avoid conflicts
	}
	if (member_name!=null) {
		fetching_flag_name = member_name.toLowerCase(); // case insensitive
		fetching_flag_name = fetching_flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine
		search_member_data(member_name)
		document.getElementsByClassName('sort_button')[0].style.visibility = "hidden";
	}
	if ((role_name!=null)&&(!role_name.includes("no_more_staff"))&&(!role_name.includes("icate"))) { // no_more_staff = resigned list, icate = duplicate/triplicate roles
		role_name = role_name.toLowerCase()
		if (role_name=="socialmedia") {
			search_socials()
		} else {
			search_role_data(role_name)
		}
		document.getElementsByClassName('sort_button')[0].style.visibility = "visible";
		if (sort_type=="language") {

			document.getElementsByClassName('bottom_button')[1].innerText = "Default sorting";
			document.getElementsByClassName('bottom_button')[1].href = `https://heroes.wolvesville.com/list.html?role=${role_name}`;
		} else {
			document.getElementsByClassName('bottom_button')[1].href = `https://heroes.wolvesville.com/list.html?role=${role_name}&sort=language`;
		}
	}
	if ((language_parameter!=undefined)&&(text_to_flag[language_parameter]==undefined)) { // Error 400 (bad request)
		document.getElementById("staff_member_name").innerText = "Invalid argument"
		document.getElementsByClassName("list_category")[0].style.display = "none"
		document.getElementsByClassName("list_category")[1].style.display = "none"
		document.getElementsByClassName("list_category")[2].style.display = "none"
		document.getElementsByClassName("languages")[0].style.display = "none"
		document.getElementsByClassName("artist")[0].innerText = "Jaküm Astrotel#3772"
		document.getElementsByClassName('birthday')[0].style.display = "block"
		document.getElementsByClassName("birthday")[0].innerHTML = "You found yourself in a weird place... <br> <br> Go back <a class='yellow' href='https://heroes.wolvesville.com/'>home?</a>"
		document.getElementsByClassName('backgroundImage')[0].style.backgroundImage = "url(Pictures/404.png)"
		return
	}
	if ((!member_is_found)&&(!role_is_found)) { // Error 404 (nothing found)
		document.getElementById("staff_member_name").innerText = "Nothing found"
		document.getElementsByClassName("list_category")[0].style.display = "none"
		document.getElementsByClassName("list_category")[1].style.display = "none"
		document.getElementsByClassName("list_category")[2].style.display = "none"
		document.getElementsByClassName("languages")[0].style.display = "none"
		document.getElementsByClassName("artist")[0].innerText = "Jaküm Astrotel#3772"
		document.getElementsByClassName('birthday')[0].style.display = "block"
		document.getElementsByClassName("birthday")[0].innerHTML = "You found yourself in a weird place... <br> <br> Go back <a class='yellow' href='https://heroes.wolvesville.com/'>home?</a>"
		document.getElementsByClassName('backgroundImage')[0].style.backgroundImage = "url(Pictures/404.png)"
		return
	}
}

let list_to_add = [],all_member_positions = [],all_role_members = [],all_role_members_languages = [];

function Func() {
    fetch("./data/Members.json")
        .then((res) => {
        return res.json();
    })
    .then((data) => console.log(data));
}

function get_user_from_name(member_name) {
	/*
	pre: member_name is the name of a staff member from the "Members" table
	post: returns a list of objects corresponding to the database entries with the same name

	Example:
	"Arnaud" will return a list of length 4 (Discord, Mentor, SMM, TC)
	"Mmaarten" will return a list of length 1 (Mentor)
	"InvalidName" will return an empty list
	
	The values in the list correspond to the json objects
	*/

	members = 
}

function search_member_data(member_name) {
	// pre: Staff member is defined
	// post: Creates a page with all member data
	document.title = "User info"
	document.getElementById("staff_member_name").innerText = member_name
	document.getElementsByClassName("list_category")[0].style.display = "none" // role info -> if not a role, disappear
	document.getElementsByClassName("current_info")[0].innerText = "Current status"
	has_resigned = true // This is to check if they have no more staff roles
	for_how_long = 0
	for (var i = 0; i < whole_staff_list.length; i++) { // every category
		for (var j = 0; j < whole_staff_list[i].length; j++) { // every staff member
			staff_member = whole_staff_list[i][j]
			if (staff_member.name==member_name) { // checking if matching name
				member_is_found = true
				fill_member_data()
			}
		}
	}
	list_to_add.sort()
	for (var i = 0; i < list_to_add.length; i++) { // for every unix date, look back to what it's corresponding to
		for (var j = 0; j < all_member_positions.length; j++) { // for all categories
			for (var k = 0; k < Object.keys(all_member_positions[j]).length; k++) { // for all roles
				object_part = Object.keys(all_member_positions[j])[k]
				already_shown = false
				if (list_to_add[i]==all_member_positions[j][object_part]) {
					temp_time = new Date(list_to_add[i]*1000); // from unix to object
					if (object_part.includes("no_more_staff")) {
						object_part = Object.keys(all_member_positions[j])[k-1]
						let line_creation = document.createElement('li');
						line_creation.innerHTML = "No longer was a " + positions_result_text[object_part]
						document.getElementsByClassName("rang")[1].appendChild(line_creation)
					} else {
						let line_creation = document.createElement('li');
						add_rank_link(line_creation,positions_result_text[object_part]) 
						document.getElementsByClassName("rang")[1].appendChild(line_creation)
					}
					day = temp_time.getDate()
					if (day<10) {
						day = "0" + day
					}
					month = months[temp_time.getMonth()] // going from number to string
					let line_creation = document.createElement('li');
					line_creation.innerText = day + " " + month + " " + (temp_time.getYear() + 1900)
					document.getElementsByClassName("rang")[2].appendChild(line_creation)
				}
			}
		}
	}
	birthday_index = member_name.replace(/\s/g,'') // you can't put a space in an object property
	if (staff_birthdays[birthday_index]!=undefined) {
		document.getElementsByClassName('birthday')[0].innerText = "Birthday: " + staff_birthdays[birthday_index]
	} else {
		document.getElementsByClassName('birthday')[0].style.display = "none"
	}
	if (staff_languages[fetching_flag_name]!=undefined) {
		temp_string = "English" // all staff speaks english
		for (var i = 0; i < staff_languages[fetching_flag_name].length; i++) {
			temp_string += ", " + staff_languages[fetching_flag_name][i] // adding all spoken languages one by one, space after the comma
		}
		document.getElementsByClassName('languages')[0].innerText = "Languages spoken: " + temp_string
	} else {
		document.getElementsByClassName('languages')[0].innerText = "Language spoken: English"
	}
	if (has_resigned) {
		document.getElementsByClassName("rang")[0].innerHTML = "This user no longer has any staff role."
	}
	if (max_years!=0) {
		document.getElementsByClassName("rang")[0].innerHTML += "<br>Has been staff for over " + years_to_text[max_years-1] + " <img src='https://cdn.discordapp.com/emojis/590721116990078997.png' class='mini_img'>"
	}
}

function fill_member_data() {
	all_member_positions[all_member_positions.length] = staff_member // in case they're in more than one category
	object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1] // getting last value for current role(s)
	// Current status
	if (!object_part.includes("no_more_staff")) {
		let line_creation = document.createElement('div');
		add_rank_link(line_creation,positions_result_text[object_part])
		document.getElementsByClassName("rang")[0].appendChild(line_creation)
		has_resigned = false
	}
	// Are they over a year?
	var unix_today = Math.round((new Date()).getTime()); // today in unix
	if (Object.keys(staff_member)[2]=="id") { // to use the first staff role and not the id property
		object_part = Object.keys(staff_member)[3]
	} else {
		object_part = Object.keys(staff_member)[2]
	}
	if (staff_member["no_more_staff"]==undefined) {
		if (staff_member[object_part]+31536000<unix_today/1000) {
			for_how_long = 1
		}
		if (staff_member[object_part]+31536000*2<unix_today/1000) {
			for_how_long = 2
		}
		if (staff_member[object_part]+31536000*3<unix_today/1000) {
			for_how_long = 3
		}
	} else {
		if (staff_member[object_part]+31536000<staff_member["no_more_staff"]) {
			for_how_long = 1
		}
		if (staff_member[object_part]+31536000*2<staff_member["no_more_staff"]) {
			for_how_long = 2
		}
		if (staff_member[object_part]+31536000*3<staff_member["no_more_staff"]) {
			for_how_long = 3
		}
	}
	if (for_how_long>max_years) {
		max_years = for_how_long
	}
	// Update dates
	for (var k = 2; k <  Object.keys(staff_member).length; k++) { // for every position change
		if (Object.keys(staff_member)[k]!="id") { // some start at 2, some at 3
			object_part = Object.keys(staff_member)[k]
			list_to_add[list_to_add.length] = staff_member[object_part]
		}
	}
}

function search_role_data(role_name) {
	document.title = "Role info"
	amount_of_staff = 0
	object_part = role_name
	document.getElementById("staff_member_name").innerHTML = positions_result_text[role_name]
	document.getElementById("staff_member_name").style.color = positions_colours[role_name]
	document.getElementsByClassName('role_explanation')[0].innerHTML = positions_explanation[role_name]
	add_explanation_details()
	for (var i = 0; i < whole_staff_list.length; i++) { // every category
		for (var j = 0; j < whole_staff_list[i].length; j++) { // every staff member
			staff_member = whole_staff_list[i][j]
			if (staff_member[role_name]!=undefined) { // checking if matching name 
				role_is_found = true
				if (language_parameter==undefined) {
					fill_role_data()
					} else {
					fetching_flag_name = staff_member.name.toLowerCase(); // case insensitive
					fetching_flag_name = fetching_flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine
					if (staff_languages[fetching_flag_name]!=undefined) { // That "if" contains the other "if" to avoid undef. errors
						if (staff_languages[fetching_flag_name].includes(language_parameter)) {
							fill_role_data()
						}
					}
				}
				
			}
		}
	}
	if (sort_type=="language") {
		for (var i = 0; i < all_role_members.length; i++) {
			fetching_flag_name = all_role_members[i].name.toLowerCase()
			fetching_flag_name = fetching_flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine
			all_role_members_languages[i] = staff_languages[fetching_flag_name]
		}
		temp_list = SortingArrays(all_role_members_languages,all_role_members)
		for (var i = 0; i < temp_list.length; i++) {
			staff_member = temp_list[i]
			if (staff_member!=undefined) { // idk why, but 29th is undef
				object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1] // getting last value for current role(s)
				if (!object_part.includes("no_more_staff")) {
					let line_creation = document.createElement('div');
					add_member_link(line_creation,staff_member.name)
					if (discord_positions[role_name]==true) {
						if (object_part==role_name) {
							document.getElementsByClassName("rang")[0].appendChild(line_creation)
							amount_of_staff ++
						}
					} else {
						document.getElementsByClassName("rang")[0].appendChild(line_creation)
						amount_of_staff ++
					}
				}
				// adding name to update dates
				let line_creation = document.createElement('li');
				add_member_link(line_creation,staff_member.name)
				document.getElementsByClassName("rang")[1].appendChild(line_creation)
				// adding update date
				temp_time = new Date(staff_member[role_name]*1000); // from unix to object
				day = temp_time.getDate()
				if (day<10) {
					day = "0" + day
				}
				month = months[temp_time.getMonth()] // going from number to string
				line_creation = document.createElement('li');
				line_creation.innerText = day + " " + month + " " + (temp_time.getYear() + 1900)
				document.getElementsByClassName("rang")[2].appendChild(line_creation)
			}
		}
	} else { // sorting by unix timestamp
		list_to_add.sort() // sorting unix values from oldest to newest
		temp_list = list_to_add
		for (var i = 0; i < temp_list.length; i++) { 
			already_shown = false
			for (var j = 0; j < all_role_members.length; j++) {
				staff_member = all_role_members[j]
				if (temp_list[i]==staff_member[role_name]) {
					if (already_shown) {
						i++
					} else {
						already_shown = true
					}
					// adding name to current members
					object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1] // getting last value for current role(s)
					if (!object_part.includes("no_more_staff")) {
						let line_creation = document.createElement('div');
						add_member_link(line_creation,staff_member.name)
						if (discord_positions[role_name]==true) {
							if ((object_part.includes(role_name))&&((object_part!="megamod")||(role_name=="megamod"))) { // Override to avoid a minor bug
								document.getElementsByClassName("rang")[0].appendChild(line_creation)
								amount_of_staff ++
							}
						} else {
							document.getElementsByClassName("rang")[0].appendChild(line_creation)
							amount_of_staff ++
						}
					}
				}
			}
		}
		temp_list = list_to_add
		for (var i = temp_list.length - 1; i >= 0; i--) {
			already_shown = false
			for (var j = 0; j < all_role_members.length; j++) {
				staff_member = all_role_members[j]
				if (temp_list[i]==staff_member[role_name]) {		
					if (already_shown) {
						i--
					} else {
						already_shown = true
					}
					// adding name
					let line_creation = document.createElement('li');
					add_member_link(line_creation,staff_member.name)
					document.getElementsByClassName("rang")[1].appendChild(line_creation)
					// adding update date
					temp_time = new Date(list_to_add[i]*1000); // from unix to object
					day = temp_time.getDate()
					if (day<10) {
						day = "0" + day
					}
					month = months[temp_time.getMonth()] // going from number to string
					line_creation = document.createElement('li');
					line_creation.innerText = day + " " + month + " " + (temp_time.getYear() + 1900)
					document.getElementsByClassName("rang")[2].appendChild(line_creation)
				}
			}
		}
	}
	if (document.getElementsByClassName("rang")[0].innerText=="") {
		document.getElementsByClassName("rang")[0].innerText = "There is currently no user with this role."
	}
	document.getElementsByClassName("current_info")[0].innerText = `Current members (${amount_of_staff})`
}

function fill_role_data() {
	all_role_members[all_role_members.length] = staff_member // to order 
	list_to_add[list_to_add.length] = staff_member[role_name]
	all_role_members_languages[all_role_members/*and not the language  var!*/.length] = staff_languages[fetching_flag_name]
}

function add_member_link(html_element,member_name) {
	let flag_container = document.createElement('div')
	flag_container.classList = "flag_container"
	fetching_flag_name = member_name.toLowerCase()
	fetching_flag_name = fetching_flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine
	if (staff_languages[fetching_flag_name]!=undefined) {
		for (var i = 0; i < staff_languages[fetching_flag_name].length; i++) { // can be reversed for better appearance
			temp_img = document.createElement('img')
			temp_img.src = text_to_flag[staff_languages[fetching_flag_name][i]]
			temp_img.classList = "mini_img"
			flag_container.appendChild(temp_img)
		}
		//console.log(flag_container)
	} else { // only speaks english
		temp_img = document.createElement('img')
		temp_img.src = text_to_flag["English"]
		temp_img.classList = "mini_img"
		flag_container.appendChild(temp_img)	
	}
	/*temp_img = document.createElement('img') // This part adds an english flag to all names
	temp_img.src = text_to_flag["English"]
	temp_img.classList = "mini_img"
	flag_container.appendChild(temp_img)*/
	// span is to avoid bullet color change
	let link = document.createElement('a');
	link.innerHTML = member_name
	link.href = "?member=" + member_name
	link.classList = "name_link"
	html_element.appendChild(link)
	/*let spacer = document.createElement('div')
	spacer.classList = "spacer_flag"
	link.appendChild(spacer)*/
	link.appendChild(flag_container)
}

function add_rank_link(html_element,text) {
	let link = document.createElement('a');
	link.innerHTML = text
	if ((discord_positions[object_part]==false)) {
		link.href = "?role=socialmedia"
	} else if (object_part.includes('icate')) {
		link.href = "?role=" + duplicate_link_fix[object_part]
	} else {
		link.href = "?role=" + object_part
	}
	link.classList = "role_link"
	link.style.color = positions_colours[object_part]
	html_element.appendChild(link)
}
function add_explanation_details() {
	link = document.getElementsByClassName('role_link')
	for (var i = link.length - 1; i >= 0; i--) {
		if (link[i].href=="") {
			object_part = link[i].innerText.replace(/\s/g,'');
			link[i].href = "?role=" + object_part
			link[i].style.color = positions_colours[object_part]
		}
	}
}

function search_socials() {
	document.title = "Role info"
	amount_of_staff = 0
	object_part = role_name
	document.getElementById("staff_member_name").innerHTML = positions_result_text[role_name]
	document.getElementById("staff_member_name").style.color = positions_colours[role_name]
	document.getElementsByClassName('role_explanation')[0].innerHTML = positions_explanation[role_name]
	add_explanation_details()
	for (var j = 0; j < whole_staff_list[3].length - 3; j++) { // every staff member EXCEPT the 3 last ones as they're duplicates
		staff_member = whole_staff_list[3][j] // 3 = smms
		object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1]
		role_is_found = true
		all_role_members[all_role_members.length] = staff_member // to order 
		list_to_add[list_to_add.length] = staff_member[object_part]
	}
	list_to_add.sort() // sorting unix values from oldest to newest
	temp_list = list_to_add
	for (var i = 0; i < temp_list.length; i++) { 
		already_shown = false
		for (var j = 0; j < all_role_members.length; j++) {
			staff_member = all_role_members[j]
			object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1] // getting last value for current role(s)
			if (temp_list[i]==staff_member[object_part]) {
				if (already_shown) {
					i++
				} else {
					already_shown = true
				}
				// adding name to current members
				if (!object_part.includes("no_more_staff")) {
					let line_creation = document.createElement('div');
					add_member_link(line_creation,staff_member.name)
					document.getElementsByClassName("rang")[0].appendChild(line_creation)
					amount_of_staff++
				}
			}
		}
	}
	temp_list = list_to_add
	for (var i = temp_list.length - 1; i >= 0; i--) {
		already_shown = false
		for (var j = 0; j < all_role_members.length; j++) {
			staff_member = all_role_members[j]
			object_part = Object.keys(staff_member)[Object.keys(staff_member).length-1] // getting last value for current role(s)
			if (temp_list[i]==staff_member[object_part]) {		
				if (already_shown) {
					i--
				} else {
					already_shown = true
				}
				// adding name
				let line_creation = document.createElement('li');
				add_member_link(line_creation,staff_member.name)
				document.getElementsByClassName("rang")[1].appendChild(line_creation)
				// adding update date
				temp_time = new Date(list_to_add[i]*1000); // from unix to object
				day = temp_time.getDate()
				if (day<10) {
					day = "0" + day
				}
				month = months[temp_time.getMonth()] // going from number to string
				line_creation = document.createElement('li');
				line_creation.innerText = day + " " + month + " " + (temp_time.getYear() + 1900)
				document.getElementsByClassName("rang")[2].appendChild(line_creation)
			}
		}
	}
	if (document.getElementsByClassName("rang")[0].innerText=="") {
		document.getElementsByClassName("rang")[0].innerText = "There is currently no user with this role."
	}
	document.getElementsByClassName("current_info")[0].innerText = `Current members (${amount_of_staff})`
}


function show_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "flex"
}
function hide_menu() {
	document.getElementsByClassName('mobile_navigation')[0].style.display = "none"
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