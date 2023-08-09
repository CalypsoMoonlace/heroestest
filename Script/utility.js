// This file contains some utility functions used in other .html or .js files

async function get_db_from_name(db_name) {
    // pre: db_name is the name of an existing database
    // post: returns the content of that database
    const response = await fetch(`./Script/data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

async function get_all_dbs() {
    // pre: Role db is defined
    // post: returns an array of all category databases, eg ["Discord", "Mentor", "Guardian", ...]
    databases = []
    let role_db = await get_db_from_name("Role")
    role_db.forEach(role => {
        if (!databases.includes(role.category) && role.category) {
            databases.push(role.category)
        }
    })
    return databases
}

function unix_to_date(timestamp) {
    // pre: timestamp is a unix timestamp from the database
    // post: returns "dd month yyyy"
    // example: 0 -> "01 January 1900"
    let date_obj = new Date(timestamp*1000); // from unix to object
    
    let day = date_obj.getDate()
    if (day<10) {
        day = "0" + day
    }

    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    let month = months[date_obj.getMonth()] // going from number to string

    let year = date_obj.getYear() + 1900

    result = day + " " + month + " " + year
    return result
}

function find_previous_role(staff, unix) {
    /*
    pre: staff is an object from a category database, unix is a unix timestamp
    post: returns the role the staff member had just before the unix value
    */
    let last = 0
    let last_key = ""

    for (var i = 0; i < Object.keys(staff).length; i++) { // for each key
        let key = Object.keys(staff)[i]

        if (key == socialmedia) {
            continue // socialmedia is already treated by specific socialmedia fields (instagram, twitter, etc)
        }

        if (!staff[key]) {
            continue // move on if empty field
        }

        staff[key].toString().split(" ").forEach(value => { // in case a key has 2+ values
            if (value < unix && value > last) {
                // found a new role closer to the previous one
                last = value
                last_key = key
            }
        })
    }

    return last_key
}

function add_rank_link(role_db) {
    // pre: body is loaded, role_db is the data from the Role database and all role_link elements contain the text of a role
    // post: adds a link & the colour of the role
    Array.from(document.getElementsByClassName("role_link")).forEach(link => {
        let text = link.innerHTML
                    .toLowerCase() // case sensitivity
                    .trim() // extra spaces
                    .replaceAll(`\"`,`\'`) // try with ' first

        let role_data = role_db.find(elmt => elmt.display_name.toLowerCase() == text)

        if (!role_data) {
            // if nothing found, try again by replacing quotation marks
            let text = link.innerHTML
                        .toLowerCase() // case sensitivity
                        .trim() // extra spaces
                        .replaceAll(`\'`,`\"`) // try with " second
            role_data = role_db.find(elmt => elmt.display_name.toLowerCase() == text)
        }

        if (!role_data) {
            // if still nothing found, try again with regular name
            role_data = role_db.find(elmt => elmt.name.toLowerCase() == text)
        }

        if (role_data && !link.href) {
            link.href = `list?role=${role_data.name}`
            link.style.color = role_data.colour
        }
    })
}

function add_member_link() {
    // pre: body is loaded and all name_link elements contain the name of a staff member
    // post: adds a link to the user page
    Array.from(document.getElementsByClassName("name_link")).forEach(link => {
        if (!link.href) { // if not already defined
            link.href = `list?member=${link.innerText}`
        }
    })
}

async function default_loading() {
    /*
    pre: body is loaded
    post: adds rank & name links
    note: this is the default loading function for pages that don't rely on a heavy scripting (index, overview, etc)
    */
    let role_db = await get_db_from_name('Role')
    add_rank_link(role_db)
    add_member_link()

}

// Mobile menu functions
function show_menu() {
    document.getElementsByClassName('mobile_navigation')[0].style.display = "flex"
}

function hide_menu() {
    document.getElementsByClassName('mobile_navigation')[0].style.display = "none"
}