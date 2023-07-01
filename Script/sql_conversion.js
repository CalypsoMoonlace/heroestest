/* 

	This files initiates/resets the database using data from TimeMachineData.js

	DO NOT USE unless you know what you're doing!

	How to reset:
	- Set "creation = true"
	- Run the code ("node sql_conversion.js") in terminal
	- Set "creation = false" and rerun in terminal

*/
let creation = false

// Import data
const {whole_staff_list} = require('./TimeMachineData.js')
const {staff_languages} = require('./TimeMachineData.js')
const {staff_birthdays} = require('./TimeMachineData.js')


// Check if connection is valid
async function check_connection() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');

		if (creation) {
			await sequelize.sync({ force: true });
			console.log('Database reset successfully.');
		}
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	};
}


// Import Sequelize
const { Sequelize , DataTypes , Model } = require("sequelize")

// Creation of database link
const sequelize = new Sequelize ({
	dialect : "sqlite" ,
	storage : "finalproject.sqlite", // file name
    define: { 
		timestamps: false, // disable createdAt & updatedAt
        freezeTableName: true //prevent sequelize from pluralizing table names
    }
})

check_connection()

// Database initialisation (definition of tables)
class Member extends Model{}
Member.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    categories: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    birthday: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {sequelize});


class Discord extends Model{}
Discord.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    trialhelper: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    helper: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trialminimod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    minimod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    megamod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class Mentor extends Model{}
Mentor.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mentor: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mentormanagerhelper: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mentormanager: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class Guardian extends Model{}
Guardian.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    guardian: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    guardianmanagerhelper: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    guardianmanager: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class SocialMedia extends Model{}
SocialMedia.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    socialmedia: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    instagram: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    facebook: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    twitter: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reddit: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class TesterClub extends Model{}
TesterClub.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tc_mod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tc_admin: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class Developer extends Model{}
Developer.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Member,
            key: "name"
        }
    },
    current: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dev: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resigned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resigned_from: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    languages: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

class Role extends Model{}
Role.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    display_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    colour: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creation: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {sequelize});

// Save the empty tables
sequelize.sync()
if (creation) {
	return // stop here
}

// Database setup (entering values into the database)
// Initialise
let names = [];
let categories = [];
let languages = [];
let birthdays = [];

let category_names = ["Discord", "Mentor", "Guardian", "SocialMedia", "TesterClub", "Developer"]

// Add to Roles
let role_categories = {
	trialhelper: "Discord",
	helper: "Discord",
	trialminimod: "Discord",
	minimod: "Discord",
	mod: "Discord",
	megamod: "Discord",
	guardian: "Guardian",
	guardianmanagerhelper: "Guardian",
	guardianmanager: "Guardian",
	mentor: "Mentor",
	mentormanagerhelper: "Mentor",
	mentormanager: "Mentor",
	reddit: "SocialMedia",
	instagram: "SocialMedia",
	facebook: "SocialMedia",
	twitter: "SocialMedia",
	socialmedia: "SocialMedia",
	dev: "Developer",
	tc_mod: "TesterClub",
	tc_admin: "TesterClub"
}

let role_descriptions = {
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
	tc_admin: 'They take care of the <a href="https://discord.gg/SDujygY" target="_blank" class="yellow">Tester Club</a> sideserver with almost all permissions.',
	resigned: 'They no longer are a staff member.'
}

let role_colours = {
	trialhelper: "#d7bf4c",
	helper: "#dfac39",
	trialminimod: "#ed904a",
	minimod: "#e1823b",
	mod: "#da685c",
	megamod: "#CF5050",
	guardian: "#18d0ff",
	guardianmanagerhelper: "#18d0ff",
	guardianmanager: "#00b1ff",
	mentor: "#f26f93",
	mentormanagerhelper: "#eb6a8c",
	mentormanager: "#f2557f",
	reddit: "#4962fd",
	instagram: "#4962fd",
	facebook: "#4962fd",
	twitter: "#4962fd",
	socialmedia: "#4962fd",
	dev: "#F1C40F",
	tc_mod: "#00bfff",
	tc_admin: "#17afbd",
	resigned: "#FFFFFF"
}

let display_names = {
	trialhelper: "Trial Helper",
	helper: "Helper",
	trialminimod: "Trial Minimod",
	minimod: "Minimod",
	mod: "Moderator",
	megamod: "Megamod",
	guardian: "Guardian",
	guardianmanagerhelper: "Guardian Manager Helper",
	guardianmanager: "Guardian Manager",
	mentor: "Mentor",
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
	tc_manager: "Manager <img src='https://cdn.discordapp.com/attachments/587307618155102257/758745910187786280/Testers_Club.png' class='mini_img'>",
	resigned: "This user no longer has any staff role."
}

Object.keys(role_colours).forEach(key => {
	Role.create({
		name: key,
		category: role_categories[key],
		display_name: display_names[key],
		description: role_descriptions[key],
		colour: role_colours[key],
		creation: 0
	})
})

// Add to Members
for (var i = 0; i < whole_staff_list.length; i++) {
	for (var j = 0; j < whole_staff_list[i].length; j++) {

		let staff = whole_staff_list[i][j];

		if (!names.includes(staff.name)) {
			// If name is not present yet, add data

			// For some reason, I thought it would be a good idea to not have the same formats of name across the code. 
			// Let's standardize things now.

			flag_name = staff.name.toLowerCase()
			flag_name = flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine

			temp_string = "English"
			if (staff_languages[flag_name]) {
				staff_languages[flag_name].forEach(elmt => temp_string += " " + elmt) // ["German", "Dutch"] => "English German Dutch"
			}

			birthday_name = staff.name.replace(/\s/g,'')

			// Push data
			names.push(staff.name)
			categories.push(category_names[i])
			languages.push(temp_string)
			birthdays.push(staff_birthdays[birthday_name])
		} else {
			// Add the other category to already-existing profile
			categories[names.indexOf(staff.name)] += " " + category_names[i]
		}
	}
}


function sanitize_object(staff) {
	/*
	pre: any staff object that may contain a duplicate role name
	post: duplicate role names have been merged 
		  the old current_value updated
		  the format for SMMs changed

	Exemples:
	{current_value: "helper_duplicate", helper: abc, helper_duplicate: xyz} => {current_value: "helper", helper: "abc xyz"}
	{current_value: "instagram", instagram: abc} => {current_value: "socialmedia", socialmedia: abc, media: "instagram"}
	{current_value: "no_more_staff", no_more_staff: abc} => {current_value: "resigned", no_more_staff: abc}
	*/
	staff = JSON.parse(JSON.stringify(staff)) // deep copy
	media = ""
	smm = ""

	// Merge values
	Object.keys(staff).forEach(key => {
		if (staff[key + "_duplicate"]) {
			staff[key] += " " + staff[key + "_duplicate"];
		}

		if (staff[key + "_triplicate"]) {
			staff[key] += " " + staff[key + "_triplicate"];
		}

		if (key == "instagram" || key == "facebook" || key == "twitter" || key == "reddit") {
			media += " " + key
			smm += " " + staff[key]
		}
	})

	staff.media = media.trim() // remove extra space
	staff.smm = smm.trim()

	// Replace old current_value by new
	new_currents = {
		trialhelper_duplicate: "trialhelper",
		helper_duplicate: "helper",
		minimod_duplicate: "minimod",
		minimod_triplicate: "minimod",
		mod_duplicate: "mod",
		mentor_duplicate: "mentor",
		guardian_duplicate: "guardian",
		instagram: "socialmedia",
		instagram_duplicate: "socialmedia",
		facebook: "socialmedia",
		twitter: "socialmedia",
		reddit: "socialmedia",
		no_more_staff: "resigned",
		no_more_staff_duplicate: "resigned"
	}

	if (new_currents[staff.current_value]) {
		staff.current_value = new_currents[staff.current_value]
	}

	// Get last value before each resign (if any)
	if (staff.no_more_staff) {
		staff.resigned_from = ""

		// do it for all resigns, one by one
		staff.no_more_staff.toString().split(" ").forEach(resign => {
			let last = 0
			let last_key = ""

			Object.keys(staff).forEach(key => { // for each key
				staff[key].toString().split(" ").forEach(value => { // in case a key has 2+ values
					if (value < resign && value > last) {
						// found a new role closer to the resign
						last = value
						last_key = key
					}
				})
				
			})
			staff.resigned_from += " " + last_key.split("_")[0] // avoid _duplicates and so on
		})

		staff.resigned_from = staff.resigned_from.trim()
	}

	// Add the flag values BUT without "English" prefix (unless user only speaks English)
	// This is to make filter & sort simpler at the cost of data redundancy
	flag_name = staff.name.toLowerCase()
	flag_name = flag_name.replace(/\s/g,'').replace('7',''); // removing spaces and "7" because of 7mlapine

	temp_string = ""
	if (staff_languages[flag_name]) {
		staff_languages[flag_name].forEach(elmt => temp_string += " " + elmt) // ["German", "Dutch"] => "German Dutch"
	}
	if (!temp_string) {
		temp_string = "English"
	}
	staff.languages = temp_string.trim()

	return staff;
}



// Create all database entries
// Member database
for (var i = 0; i < names.length; i++) {
	Member.create({
		name: names[i],
		categories: categories[i],
		languages: languages[i],
		birthday: birthdays[i]
	})
}

// Discord database
whole_staff_list[0].forEach(staff => {
	sane_staff = sanitize_object(staff);

	Discord.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		trialhelper: sane_staff.trialhelper,
		helper: sane_staff.helper,
		trialminimod: sane_staff.trialminimod,
		minimod: sane_staff.minimod,
		mod: sane_staff.mod,
		megamod: sane_staff.megamod,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// Mentor database
whole_staff_list[1].forEach(staff => {
	sane_staff = sanitize_object(staff);

	Mentor.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		mentor: sane_staff.mentor,
		mentormanagerhelper: sane_staff.mentormanagerhelper,
		mentormanager: sane_staff.mentormanager,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// Guardian database
whole_staff_list[2].forEach(staff => {
	sane_staff = sanitize_object(staff);

	Guardian.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		guardian: sane_staff.guardian,
		guardianmanagerhelper: sane_staff.guardianmanagerhelper,
		guardianmanager: sane_staff.guardianmanager,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// SocialMedia database
whole_staff_list[3].forEach(staff => {
	sane_staff = sanitize_object(staff);

	SocialMedia.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		socialmedia: sane_staff.smm,
		instagram: sane_staff.instagram,
		facebook: sane_staff.facebook,
		twitter: sane_staff.twitter,
		reddit: sane_staff.reddit,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// TesterClub database
whole_staff_list[4].forEach(staff => {
	sane_staff = sanitize_object(staff);

	TesterClub.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		tc_mod: sane_staff.tc_mod,
		tc_admin: sane_staff.tc_admin,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// Developer database
whole_staff_list[5].forEach(staff => {
	sane_staff = sanitize_object(staff);

	Developer.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		dev: sane_staff.dev,
		resigned: sane_staff.no_more_staff,
		resigned_from: sane_staff.resigned_from,
		languages: sane_staff.languages
	})
})

// Save
sequelize.sync()