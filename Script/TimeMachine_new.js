// This file is used to load the timemachine.html page

// global variable
let simulation_time;

async function get_users_from_role(role_name, timestamp) {
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

async function loading() {
    /*
    pre: body is loaded
    post: adds all relevant information on body by initialising TimeMachine to current time
    */
    simulation_time = (new Date()).getTime() / 1000; // today in unix
    let role_db = await get_db_from_name("Role")

    for (var i = role_db.length - 1; i >= 0; i--) { // reverse to get correct order on page
        let role = role_db[i]
        console.log(role.name)

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

    load_machine_from_stamp(simulation_time);

    // Add role & member links
    add_rank_link(role_db)
    add_member_link()
}

async function load_machine_from_stamp(timestamp) {
    /*
    pre: body is loaded, timestamp is the unix timestamp of the TimeMachine's time
    post: removes all previous names, adds new names and hides roles that don't contain any users
    */
    let role_db = await get_db_from_name("Role")

    // Erase previous data
    Array.from(document.getElementsByClassName('user_list')).forEach(html_element => {
        html_element.innerHTML = ""
    })

    // Load all data
    for (var i = 0; i < role_db.length; i++) {
        let role = role_db[i]

        if (role.name == "socialmedia" || role.name == "resigned") {
            continue // exceptions, avoid them
        }

        // Get users data
        let users_data = await get_users_from_role(role.name,timestamp)

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

    // Update date
    document.getElementById('date').innerText = `Staff on the ${unix_to_date(timestamp)}`
}

async function change_date(delta_time) {
    /*
    pre: simulation_time is a global variable
    post: updates simulation_time and the page
    */
    simulation_time += delta_time
    await load_machine_from_stamp(simulation_time)
}