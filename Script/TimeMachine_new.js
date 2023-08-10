// This file is used to load the timemachine.html page

// global variables
let simulation_time,current_staff;

function unix_to_ddmm(timestamp) {
    // pre: timestamp is a unix timestamp
    // post: returns "dd/mm"
    // example: 0 -> "1/1"

    let date_obj = new Date(timestamp*1000); // From unix to object
    let day = date_obj.getDate()
    let month = date_obj.getMonth()
    let date_ddmm = day + "/" + (month+1) // Format: 25/12 for example

    return date_ddmm
}

async function get_users_from_role_stamp(role_name, timestamp) {
    /* 
    pre: role_name is the name of a role (trialhelper, helper, guardian, etc)
         timestamp is an unix stamp corresponding to the TimeMachine's current value
    post: returns a list of names, unix value, current value and languages of staff during that time
    
    Example:
    "guardian" returns [ {name: Lisa, time: 1598006832, current: "guardianmanagerhelper", languages: ["German", "Dutch"]}, ...]
    "invalid_role_name" returns []

    Note: this function is essentially the same as the one in list.js except for the timestamp argument & check
    */
    let list = []

    // Find which db to look into
    let role_db = await get_db_from_name("Role")
    let role_data = role_db.find((elmt) => elmt.name == role_name)
    if (!role_data || !role_data.category) { return [] } // invalid name, no data
    let role_category = role_data.category

    // Get the role data
    let data = await get_db_from_name(role_category)
    data.forEach(elmt => {

        // Did this person ever get the role?
        if (elmt[role_name] != null) {

            // Get the last role the user had BEFORE the timestamp
            let last_role = find_previous_role(elmt,timestamp)

            // Only add the user if the last role is the SAME as the role we're looking up
            if (last_role == role_name) {

                if (typeof(elmt[role_name]) == "string") {
                    // only keep first occurence
                    new_time = parseInt(elmt[role_name].split(" ")[0])
                } else {
                    new_time = elmt[role_name]
                }

                list.push({
                    name: elmt.name,
                    time: new_time,
                    current: elmt.current,
                    languages: elmt.languages.split(" ")
                })
            }
        }
    })

    return list
}

async function loading_timemachine() {
    /*
    pre: body is loaded
    post: adds all relevant information on body by initialising TimeMachine to current time
          initialises simulation_time and current_staff
    */
    simulation_time = (new Date()).getTime() / 1000; // today in unix
    let role_db = await get_db_from_name("Role")

    for (var i = role_db.length - 1; i >= 0; i--) { // reverse to get correct order on page
        let role = role_db[i]

        if (role.name == "socialmedia" || role.name == "resigned") {
            continue // exceptions, avoid them
        }

        // For each role, generate the following: 
        /*
        <div class="megamod rang">
            <div class="megamod_titre">
                <a class="role_link">Megamod</a>
            </div>
            <div id="megamod">
            </div>
        </div>
        */
        // NB: This is not a pretty way of doing it, but it's better than before

        // Structure
        let role_html = document.createElement('div')
        role_html.classList = `${role.name} rang`

        let role_title = document.createElement('div')
        role_title.classList = "titre"

        let role_link = `<a class="role_link">${role.display_name}</a>`
        role_title.innerHTML = role_link
        role_html.appendChild(role_title)

        // User list
        let user_list = `<div id=${role.name} class="user_list"></div>`
        role_html.innerHTML += user_list

        // Add to the rest
        let category_html = document.getElementsByName(role.category)[0]
        category_html.appendChild(role_html)
    }

    // Create a list containing all current staff (names are only there once)
    current_staff = []
    let today_unix = (new Date()).getTime() / 1000

    // For all roles, check the staff list
    for (var i = 0; i < role_db.length; i++) {
        let role = role_db[i]

        if (role.name == "socialmedia" || role.name == "resigned") {
            continue // exceptions, avoid them
        }

        // Get users data
        let users_data = await get_users_from_role_stamp(role.name,today_unix) // get all staff for today

        // Add staff names to list
        users_data.forEach(user => {
            if (!current_staff.includes(user.name)) {
                current_staff.push(user.name)
            }
        })
    }
    // Now current_staff contains all current staff names

    await load_machine_from_stamp(simulation_time);
}

async function load_machine_from_stamp(timestamp) {
    /*
    pre: body is loaded, timestamp is the unix timestamp of the TimeMachine's time
    post: removes all previous names, adds new names and hides roles that don't contain any users
    */
    let role_db = await get_db_from_name("Role")

    // Update date
    document.getElementById('date').innerText = `Staff on the ${unix_to_date(timestamp)}`

    // Erase previous data
    Array.from(document.getElementsByClassName('user_list')).forEach(html_element => {
        html_element.innerHTML = ""
    })
    Array.from(document.getElementsByClassName('events_log')).forEach(html_element => {
        html_element.innerHTML = ""
    })

    // Load all data
    for (var i = 0; i < role_db.length; i++) {
        let role = role_db[i]

        if (role.name == "socialmedia" || role.name == "resigned") {
            continue // exceptions, avoid them
        }

        // Get users data
        let users_data = await get_users_from_role_stamp(role.name,timestamp)

        users_data.sort((a,b) => a.time - b.time) // sort by time

        users_data.forEach(user => {
            // Add to HTML
            let user_html = `<a class="name_link">${user.name}</a>`;
            document.getElementById(role.name).innerHTML += user_html + "<br>";
        })
    }

    // Hide empty roles
    Array.from(document.getElementsByClassName('user_list')).forEach(html_element => {
        if (html_element.innerHTML) {
            html_element.parentElement.style.display = "block"
        } else {
            html_element.parentElement.style.display = "none"
        }
    })

    // Hide empty categories
    Array.from(document.getElementsByClassName('role_list')).forEach(html_element => {
        if (html_element.offsetHeight == 0) { // actual height == 0 means no role is displayed
            html_element.parentElement.style.visibility = "hidden"
        } else {
            html_element.parentElement.style.visibility = "visible"
        }
    })

    // Get events for today
    let updates = await get_events(timestamp)
    updates.forEach(update => {
        document.getElementsByClassName('events_log')[0].innerHTML += update + "<br>"
    })

    // Get events for tomorrow
    let updates_tmr = await get_events(timestamp+86400)
    updates_tmr.forEach(update => {
        document.getElementsByClassName('events_log')[1].innerHTML += update + "<br>"
    })


    // Add role & member links
    add_rank_link(role_db)
    add_member_link()
}

async function change_date(delta_time) {
    /*
    pre: simulation_time is a global variable
    post: updates simulation_time and the page
    */
    simulation_time += delta_time
    simulation_time = Math.max(1518818553,simulation_time) // can't go lower than 1518818553, when the server was created
    await load_machine_from_stamp(simulation_time)
}

async function get_events(timestamp) {
    /*
    pre: timestamp is the unix timestamp of the simulation
    post: returns a list of strings corresponding to all events to show
    */
    let role_db = await get_db_from_name("Role")
    let updates = []

    // Get dd/mm format of simulation time
    let date_ddmm = unix_to_ddmm(timestamp) // Format: 25/12 for example

    // Check for birthdays
    let member_db = await get_db_from_name("Member")
    member_db.forEach(member => {
        if (member.birthday == date_ddmm && current_staff.includes(member.name)) { // Only add current staff's birthdays
            updates.push(`It's <a class='name_link'>${member.name}</a>'s birthday!`)
        }
    })

    // Check for promotion anniversaries
    current_staff.forEach(async name => {
        let user_data = await get_roles_from_user(name)

        user_data.roles.forEach(update => {
            
            // Get dd/mm format of that time
            let elmt_date_ddmm = unix_to_ddmm(update.time) // Format: 25/12 for example

            if (elmt_date_ddmm == date_ddmm && update.name != "resigned") {
                // It's a match!

                let role_to = role_db.find((elmt) => elmt.name == update.name)
                let years = Math.floor((timestamp - update.time) / (86400*365))
                let new_update;

                if (years == 1) {
                    // 1 year
                    let new_update = `It's been a year since <a class="name_link">${update.staff_name}</a> became <a class="role_link">${role_to.display_name}</a>`
                } else {
                    // 2+ years
                    let new_update = `It's been ${years} years since <a class="name_link">${update.staff_name}</a> became <a class="role_link">${role_to.display_name}</a>`
                }
                updates.push(new_update)
            }
        })
    })

    return updates
}