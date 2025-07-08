// This file is used to load list.html pages

async function get_users_from_role(role_name) {
    /* 
    pre: role_name is the name of a role (trialhelper, helper, guardian, etc)
    post: returns a list of names, unix value, current value and languages
    
    Example:
    "guardian" returns [ {name: Lisa, time: 1598006832, current: "guardianmanagerhelper", languages: ["German", "Dutch"]}, ...]
    "invalid_role_name" returns []
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
            // Yes, add to list

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
    })

    return list
}

async function get_roles_from_user(user_name) {
    /* 
    pre: user_name is the name of a user (Lisa, Calypso, etc)
    post: returns an object with "roles", "current", "languages" and "birthday" as keys 
          -> "roles" is a list of {name, time} objects corresponding to when a role was obtained
          -> the values are split so that if there are two unix values, they are shown separately
          -> it is sorted by time
          -> "current" is a list of strings that are the current role(s) the user has
          -> "languages" is a list of strings of the languages the user speaks
    
    Example:
    "Sonblo" returns { roles: [ {name: "trialhelper", time: 1547856000}, {name: "helper", time: 1548587013}, ... ], 
                       current: ["mod", "mentor"],
                       languages: ["English", "Dutch"],
                       birthday: "29/9"
                     }
    "Boon" returns { roles: [ {name: "trialhelper", time: 1542932401}, {name: "trialhelper", time: 1583085566}, ... ],
                     current: ["resigned"],
                     languages: ["English", "Thai"],
                     birthday: null
                   }
    "invalid_user_name" returns { roles: [], current: [], languages: []}
    */
    let result = { roles: [], current: [], languages: [] }

    // Find which db to look into
    let member_db = await get_db_from_name("Member")
    let member_data = member_db.find((elmt) => elmt.name == user_name)
    if (!member_data) { return result } // invalid name, no data
    let member_categories = member_data.categories.split(" ") // eg: member_categories = ["Discord", "Mentor"]

    // Basic information
    result.name = user_name
    result.birthday = member_data.birthday
    result.languages = member_data.languages.split(" ") // eg: results.languages = ["English", "French", "German"]

    for (var i = 0; i < member_categories.length; i++) {
        
        // Add category by category
        let category_db = await get_db_from_name(member_categories[i])
        let category_data = category_db.find((elmt) => elmt.name == user_name)

        for (var j = 0; j < Object.keys(category_data).length; j++) {
            key = Object.keys(category_data)[j]
            
            // Add all keys with data
            if (category_data[key] == null) { // Empty value, nothing to add
                continue
            }
            if (key == "languages" || key == "current" || key == "name" || key == "resigned_from") { // Those keys should not be added as they are not unix values
                continue
            } 

            // Resigns are treated differently because I need to know from which role they resigned
            if (key == "resigned") {
                // split data
                resigns = category_data[key].toString().split(" ")
                resigned_from = category_data["resigned_from"].toString().split(" ")

                // add all of them
                for (var k = 0; k < resigns.length; k++) {
                    result.roles.push({
                        name: key,
                        time: parseInt(resigns[k]),
                        from: resigned_from[k]
                    })
                }
            } else { 
                // split data
                category_data[key].toString().split(" ").forEach(entry => {
                    // add all of them
                    result.roles.push({
                        name: key,
                        time: parseInt(entry)
                    })
                })
            }
        }

        if (category_data.current != "resigned") { // avoid getting "resigned" several times
            result.current = result.current.concat(category_data.current.split(" "))
        }
    }

    if (result.current.length == 0) { // no current role = resigned
        result.current = ["resigned"]
    }

    result.roles.sort((a, b) => a.time - b.time) // sort by time

    return result
}

function filter_by_language(member_list,language) {
    return member_list.filter(member => member.languages.includes(language));
}

async function loading() {
    /*
    pre: body is loaded
    post: adds all relevant information on body
    note: this is the main function, from where everything is called
    */

    // get url parameters
    let page_url = new URLSearchParams(window.location.search);
    let member_name = page_url.get('member');
    let role_name = page_url.get('role')
    let language_parameter = page_url.get('language');
    let sort_type = page_url.get('sort');

    if (language_parameter) { // making it case insensitive
        language_parameter = language_parameter.substring(0,1).toUpperCase() + page_url.get('language').substring(1).toLowerCase()
    }

    if (member_name && role_name) {
        // if both are set, member has priority over role, to avoid conflicts
        role_name = null
    }

    if (role_name) {
        // load role info
        document.title = "Role info"
        let users_data = await get_users_from_role(role_name)

        // filter accordingly
        if (language_parameter) {
            users_data = filter_by_language(users_data,language_parameter)
        }

        // sort accordingly and show sort suggestion
        if (sort_type == "language") {
            users_data.sort((a,b) => a.languages.toString().localeCompare(b.languages.toString()))
            document.getElementsByClassName('bottom_button')[1].innerText = "Sort by name";
            document.getElementsByClassName('bottom_button')[1].href = `?role=${role_name}&sort=name`;
        } else if (sort_type == "name") {
            users_data.sort((a,b) => a.name.localeCompare(b.name))
            document.getElementsByClassName('bottom_button')[1].innerText = "Sort by time";
            document.getElementsByClassName('bottom_button')[1].href = `?role=${role_name}`;
        } else { 
            // default = sort by date
            sort_type = "time"
            users_data.sort((a,b) => a.time - b.time)
            document.getElementsByClassName('bottom_button')[1].innerText = "Sort by language";
            document.getElementsByClassName('bottom_button')[1].href = `?role=${role_name}&sort=language`;
        }

        // show the data
        show_role_info(users_data, role_name, sort_type)
    }

    if (member_name) {
        // load user info
        document.title = "User info"
        user_data = await get_roles_from_user(member_name)

        // hide sort button 
        document.getElementsByClassName('sort_button')[0].style.visibility = "hidden";

        // show the data
        show_user_info(user_data)
    }

    if (!member_name && !role_name) {
        // Error 400, bad request
        show_error(400)
    }

    // Add random button
    let member_db = await get_db_from_name("Member")
    let random_index = Math.floor(Math.random()*member_db.length)
    document.getElementsByClassName('bottom_button')[2].href = "?member=" + member_db[random_index].name
}

function user_to_flags(html_parent, user_data) {
    /*
    pre: html_parent is a HTML element, user_data is a user object (keys: name, roles, current, languages)
    post: adds text & a link to the user page and displays the flags next to the name

    Note: to download new flags, use https://github.com/twitter/twemoji/tree/master/assets/72x72 and lookup the unicode of the flag 
    */
    // Create link
    let user_html = document.createElement('a');
    user_html.innerText = user_data.name
    user_html.href = "?member=" + user_data.name
    user_html.classList = "name_link"

    // Add flags inside a flag container
    let flag_container = document.createElement('div')
    flag_container.classList = "flag_container"

    user_data.languages.forEach(language => {
        // for each flag to add
        temp_img = document.createElement('img')
        temp_img.src = `Pictures/flags/${language}.png`
        temp_img.classList = "mini_img"
        flag_container.appendChild(temp_img)
    })

    // Add changes
    user_html.appendChild(flag_container)
    html_parent.appendChild(user_html)
}

function role_to_link(html_parent, role_name, role_db) {
    /*
    pre: html_parent is a HTML element, role_data is a role object (keys: name, time), role_db is the content of the Role database
    post: adds text & a link to the role page and changes display colour to role colour
    */
    // Find the required data
    let role_data = role_db.find((elmt) => elmt.name == role_name)

    // Create link
    let role_html = document.createElement('a');

    // Add all tags to the html element
    role_html.innerHTML = role_data.display_name
    role_html.href = `?role=${role_name}`
    role_html.classList = "role_link"
    role_html.style.color = role_data.colour

    // Add changes
    html_parent.appendChild(role_html)
}

async function show_user_info(user_data) {
    /*
    pre: body is loaded
         user_data is an object (keys: name, roles, current, languages, birthday)
         => roles is a list of objects (keys: name, time) or (keys: name, time, from) for resigns
         => current & languages are a list of strings
         => see get_roles_from_user

    post: adds all the data to the "rang" class elements
          shows 404 error if no data
          doesn't return anything
    */
    if (!user_data.name) {
        // Error 404, nothing found
        show_error(404)
        return
    }

    // Get info from role db
    let role_db = await get_db_from_name("Role")

    // Add current roles
    user_data.current.forEach(role => {
        // Create role item container
        let new_role = document.createElement('div')

        // Create role item
        role_to_link(new_role, role, role_db)

        // Append
        document.getElementsByClassName("rang")[0].appendChild(new_role)
    })

    // Add role history
    for (var i = 0; i < user_data.roles.length; i++) {
        role = user_data.roles[i]
        if (role.name == "socialmedia") {
            continue // exclude socialmedia because it'll be added by the media role directly (easiest way to do it unfortunately)
        }

        // Create role item container
        let new_role = document.createElement('div')

        // Create role item
        if (role.name == "resigned") {
            // Resign case, find the previous role
            let role_data = role_db.find((elmt) => elmt.name == role.from)
            new_role.innerHTML = `No longer was a ${role_data.display_name}`

        } else { 
            role_to_link(new_role, role.name, role_db)
        }


        // Create role date
        let new_date = document.createElement('div');
        new_date.innerText = unix_to_date(role.time)

        // Append
        document.getElementsByClassName("rang")[1].appendChild(new_role)
        document.getElementsByClassName("rang")[2].appendChild(new_date)
    }

    // Display languages
    let lang_string = "Languages spoken: " + user_data.languages.join(", ")
    document.getElementsByClassName('languages')[0].innerText = lang_string

    // Display birthday or hide it
    if (user_data.birthday) {
        document.getElementsByClassName('birthday')[0].innerText = `Birthday: ${user_data.birthday}`
    } else {
        document.getElementsByClassName('birthday')[0].style.display = "none"
    }

    // Display years of service, if any
    let years = get_years_from_user(user_data.roles, role_db)
    if (years == 1) {
        document.getElementsByClassName("rang")[0].innerHTML += `<br>Has been staff for over a year <img src='https://cdn.discordapp.com/emojis/590721116990078997.png' class='mini_img'>`
    }
    if (years >= 2) {
        document.getElementsByClassName("rang")[0].innerHTML += `<br>Has been staff for over ${years} years <img src='https://cdn.discordapp.com/emojis/590721116990078997.png' class='mini_img'>`
    }

    // Display the rest of the data
    document.getElementById("staff_member_name").innerText = user_data.name
    document.getElementsByClassName("list_category")[0].style.display = "none" // role info -> if not a role, disappear
    document.getElementsByClassName("current_info")[0].innerText = "Current status"
}


function get_years_from_user(role_joins, role_db) {
    /*
    pre: role_joins is a list of objects (keys: name, time) or (keys: name, time, from) for resigns
         role_db is the data from the Role database

    post: returns the amount of years spent as a staff member
    */
    let current_categories = []
    let time = 0

    for (var i = 0; i < role_joins.length; i++) {
        // Add time since previous check
        if (i > 0 && current_categories.length > 0) {
            time += role_joins[i].time - role_joins[i-1].time
        }

        let role_data = role_db.find(elmt => elmt.name == role_joins[i].name)
        let current_index = current_categories.indexOf(role_data.category); // find if category is present

        // Update current_categories
        if (role_joins[i].name == "resigned") { 

            let role_data = role_db.find(elmt => elmt.name == role_joins[i].from)
            let remove_index = current_categories.indexOf(role_data.category); // find which category to remove
            current_categories.splice(remove_index, 1); // remove one value, starting at remove_index

        } else if (current_index < 0) { // not found, add category
            current_categories.push(role_data.category)
        }
    }

    if (current_categories.length > 0) {
        // if still has a role, add time until today
        var unix_today = (new Date()).getTime() / 1000; // today in unix
        time += unix_today - role_joins[role_joins.length-1].time
    }

    return Math.floor(time/31536000)
}

async function show_role_info(role_joins, role_name, sort_type) {
    /*
    pre: body is loaded
         role_joins is a list of user objects (keys: name, roles, current, languages, birthday)
         => see get_users_from_role
         role_name is a role name (e.g. "trialhelper") 
         sort_type is the selected sort type 

    post: adds all the data to the "rang" class elements
          shows 404 error if no data
          doesn't return anything
    */
    // Get info from role db
    let role_db = await get_db_from_name("Role")
    let role_data = role_db.find((elmt) => elmt.name == role_name)

    if (!role_data) {
        // Error 404, nothing found
        show_error(404)
        return
    }

    // Add to current
    let current_staff = 0
    role_joins.forEach(user => {
        if (user.current == role_name || (user.current != "resigned" && role_data.show_higher)) {
            // If the user has the role now OR if they have another (higher) role and the role allows showing higher positions
            current_staff++

            // Create element
            let new_user = document.createElement('div');
            user_to_flags(new_user, user)
            document.getElementsByClassName("rang")[0].appendChild(new_user)
        }
    })

    // Reverse order if sort == time because the newest should show up first
    if (sort_type == "time") {
        role_joins.reverse() 
        // NOTE: this is in place. The reason being that toReversed(), the not in place counterpart is not compatible with some browsers.
        // In theory, this doesn't break anything, but keep it in mind if adding new features.
    }

    // Add to updates
    role_joins.forEach(user => {
        // Create element
        let new_user = document.createElement('div');
        let new_date = document.createElement('div');
        user_to_flags(new_user, user)
        new_date.innerText = unix_to_date(user.time)
        document.getElementsByClassName("rang")[1].appendChild(new_user)
        document.getElementsByClassName("rang")[2].appendChild(new_date)
    })

    // Display data
    document.getElementsByClassName("current_info")[0].innerText = `Current members (${current_staff})`
    document.getElementById("staff_member_name").innerHTML = role_data.display_name
    document.getElementById("staff_member_name").style.color = role_data.colour
    document.getElementsByClassName('role_explanation')[0].innerHTML = role_data.description

    // Add links and colours
    add_rank_link(role_db)
}

function show_error(error_num) {
    /*
    pre: body is loaded, error_num is an integer
    post: shows the error on the page
    */
    document.getElementsByClassName('birthday')[0].style.display = "block"

    if (error_num == 400) { // Invalid request (e.g. no role nor user request)
        // show error on website
        document.getElementById("staff_member_name").innerText = "Invalid arguments"
        document.getElementsByClassName("birthday")[0].innerHTML = "You found yourself in a weird place... <br> <br> Go back <a class='yellow' href='https://heroes.wolvesville.com/'>home?</a>"
    }

    if (error_num == 404) { // Nothing found (e.g. wrong role/user name)
        // show error on website
        document.getElementById("staff_member_name").innerText = "Nothing found"
        document.getElementsByClassName("birthday")[0].innerHTML = "You found yourself in a weird place... <br> <br> Go back <a class='yellow' href='https://heroes.wolvesville.com/'>home?</a>"
    }

    // hide empty stuff
    document.getElementsByClassName("list_category")[0].style.display = "none"
    document.getElementsByClassName("list_category")[1].style.display = "none"
    document.getElementsByClassName("list_category")[2].style.display = "none"
    document.getElementsByClassName("languages")[0].style.display = "none"
    document.getElementsByClassName('sort_button')[0].style.visibility = "hidden";
}