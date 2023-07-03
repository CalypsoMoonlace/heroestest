// I don't like doing this, but to avoid fetching everything over again when request to show more, the following variables need to be global
let all_updates = [];
let amount_loaded = 0;

async function get_db_from_name(db_name) {
    const response = await fetch(`./Script/data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

async function get_all_dbs() {
    // pre: Role db is defined
    // post: returns an array of all category databases, eg ["Discord", "Mentor", "Guardian", ...]
    databases = []
    role_db = await get_db_from_name("Role")
    role_db.forEach(role => {
        if (!databases.includes(role.category) && role.category) {
            databases.push(role.category)
        }
    })
    return databases
}

async function get_updates_from_teams(teams) {
    /*
    pre: teams is an array of role categories, eg ["Discord", "Mentor", "Guardian", ...]
    post: returns a list of updates objects sorted by time (newest first)
    example: [ {staff_name: "Arnaud", name: "mentormanager", time: ..., from: "mentormanagerhelper"}, ... ]
    */

    updates = []

    // for each category
    for (var i = 0; i < teams.length; i++) {
        category_db = await get_db_from_name(teams[i])
        category_db.forEach(staff => {
            // for each staff in the category

            for (var j = 0; j < Object.keys(staff).length; j++) { // for each key
                key = Object.keys(staff)[j]
                
                // Add all keys with data
                if (staff[key] == null) { // Empty value, nothing to add
                    continue
                }
                if (key == "languages" || key == "current" || key == "name" || key == "resigned_from") { // Those keys should not be added as they are not unix values
                    continue
                }

                staff[key].toString().split(" ").forEach(value => { // in case a key has 2+ values
                    // Add data
                    updates.push({
                        staff_name: staff,
                        name: key,
                        time: value,
                        from: find_previous_role(staff, value)
                    })
                })
            }
        })
    }

    updates.sort((a,b) => b.time - a.time) // sort by time, newest ones come first

    return updates
}

function find_previous_role(staff, unix) {
    /*
    pre: staff is an object from a category database, unix is a unix timestamp
    post: returns the role the staff member had just before the unix value
    */
    let last = 0
    let last_key = ""

    Object.keys(staff).forEach(key => { // for each key
        staff[key].toString().split(" ").forEach(value => { // in case a key has 2+ values
            if (value < unix && value > last) {
                // found a new role closer to the previous one
                last = old
                last_key = key
            }
        })
    })

    return last_key
}

async function loading() {
    // get url parameters
    let page_url = new URLSearchParams(window.location.search);
    let amount_to_load = page_url.get('loading');
    let team_to_load = page_url.get('team');

    // Verify/update parameters to avoid crashes

    // Amount of updates that will be loaded
    if (!isNaN(amount_to_load)) {
        amount_to_load = Number.parseInt(amount_to_load)
    } else {
        amount_to_load = 50 // default amount is 50
    }

    // Which teams will be loaded
    // Update global variable to avoid fetching everything over again when showing more
    let all_dbs = await get_all_dbs()
    if (team_to_load && all_dbs.includes(team_to_load)) {
        all_updates = await get_updates_from_teams(team_to_load)
    } else {
        all_updates = await get_updates_from_teams(all_dbs) // default is to load every team
    }

    // Finally, load the data
    load_updates(amount_to_load)
}

function load_updates(amount_to_load) {
    /*
    pre: body is loaded
         all_updates and amount_loaded are defined globally
         amount_to_load is an integer
    post: adds amount_to_load new updates to the page
    */
    // start from previous loaded data
    html_parent = document.getElementsByClassName('rang')[0]

    for (var i = amount_loaded; i < amount_loaded + amount_to_load; i++) {
        // todo: add edge case if > to length

        // select update to add
        update = all_updates[i]

        // create new element
        html_child = document.createElement('div')

        // text depends on whether it's a resign, promotion or new staff member
        if (update.name == "resigned") {
            html_child.innerHTML = `<a class="name_link">${update.staff_name}</a> no longer was <a class="role_link">${update.from}</a>`
        } else if (update.from) {
            html_child.innerHTML = `<a class="name_link">${update.staff_name}</a> went from <a class="role_link">${update.from}</a> to <a class="role_link">${update.name}</a>`
        } else {
            html_child.innerHTML = `<a class="name_link">${update.staff_name}</a> became <a class="role_link">${update.name}</a>`
        }

        // append new element
        html_parent.appendChild(html_child)
    }

    // update loaded data
    amount_loaded += amount_to_load
}