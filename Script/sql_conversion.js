/* 

	This files initiates/resets the database using data from TimeMachineData.js

	DO NOT USE unless you know what you're doing!

	How to reset:
	- Remove the comments on line 23 & 24 and put all ".create()" in comments
	- Run the code ("node sql_conversion.js") in terminal
	- Undo the modifications you made above and rerun in terminal

*/

// Import data
const {whole_staff_list} = require('./TimeMachineData.js')
const {staff_languages} = require('./TimeMachineData.js')
const {staff_birthdays} = require('./TimeMachineData.js')


// Check if connection is valid
async function check_connection() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		//await sequelize.sync({ force: true });
		//console.log('Database reset successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	};
}


// Import Sequelize
const { Sequelize , DataTypes , Model } = require ("sequelize")

// Creation of database link
const sequelize = new Sequelize ({
	dialect : "sqlite" ,
	storage : "finalproject.sqlite"
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
        type: DataTypes.TEXT,
        allowNull: true
    },
    helper: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    trialminimod: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    minimod: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mod: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    megamod: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
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
        type: DataTypes.TEXT,
        allowNull: true
    },
    mentormanagerhelper: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    mentormanager: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
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
        type: DataTypes.TEXT,
        allowNull: true
    },
    guardianmanagerhelper: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    guardianmanager: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
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
    smm: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    media: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
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
        type: DataTypes.TEXT,
        allowNull: true
    },
    tc_admin: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    resigned: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {sequelize});

sequelize.sync()

// Database setup (entering values into the database)
// Initialise
let names = [];
let categories = [];
let languages = [];
let birthdays = [];

let category_names = ["Discord", "Mentor", "Guardian", "SocialMedia", "TesterClub", "Developer"]

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
	keys = Object.keys(staff)
	media = ""
	smm = ""

	// Merge values
	for (var i = 0; i < keys.length; i++) {
		key = keys[i]

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
	}

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
		resigned: sane_staff.no_more_staff
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
		resigned: sane_staff.no_more_staff
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
		resigned: sane_staff.no_more_staff
	})
})

// SocialMedia database
whole_staff_list[3].forEach(staff => {
	sane_staff = sanitize_object(staff);

	SocialMedia.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		smm: sane_staff.smm,
		media: sane_staff.media,
		resigned: sane_staff.no_more_staff
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
		resigned: sane_staff.no_more_staff
	})
})

// Developer database
whole_staff_list[5].forEach(staff => {
	sane_staff = sanitize_object(staff);

	Developer.create({
		name: sane_staff.name,
		current: sane_staff.current_value,
		dev: sane_staff.dev,
		resigned: sane_staff.no_more_staff
	})
})

// Save
sequelize.sync()