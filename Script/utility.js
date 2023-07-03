// This file contains some utility functions used in other .html or .js files

async function get_db_from_name(db_name) {
    // pre: db_name is the name of an existing database
    // post: returns the content of that database
    const response = await fetch(`./Script/data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

function unix_to_date(timestamp) {
    // pre: timestamp is a unix timestamp from the database
    // post: returns "dd month yyyy"
    // example: 0 -> "01 January 1900"
    let date_obj = new Date(timestamp*1000); // from unix to object
    
    day = date_obj.getDate()
    if (day<10) {
        day = "0" + day
    }

    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    month = months[date_obj.getMonth()] // going from number to string

    year = date_obj.getYear() + 1900

    result = day + " " + month + " " + year
    return result
}

function add_rank_link(role_db) {
    // pre: body is loaded, role_db is the data from the Role database and all role_link elements contain the text of a role
    // post: adds a link & the colour of the role
    Array.from(document.getElementsByClassName("role_link")).forEach(link => {
        let role_data = role_db.find(elmt => (elmt.display_name.toLowerCase() == link.innerText.toLowerCase())||(elmt.name.toLowerCase() == link.innerText.toLowerCase()))
        if (role_data) {
            link.href = `?role=${role_data.name}`
            link.style.color = role_data.colour
        }
    })
}

function add_name_link() {
    // pre: body is loaded and all name_link elements contain the name of a staff member
    // post: adds a link to the user page
    Array.from(document.getElementsByClassName("name_link")).forEach(link => {
        if (!link.href) {
            link.href = `?member=${link.innerText}`
        }
    })
}

function default_loading() {
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