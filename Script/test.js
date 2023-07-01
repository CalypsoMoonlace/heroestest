async function get_db_from_name(db_name) {
    const response = await fetch(`./Script/data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

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
    if (!role_data) { return [] } // invalid name, no data
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
    pre: user_name is the name of a user (Lisa, Arnaud, etc)
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
            result.current.push(category_data.current)
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
            users_data.sort((a,b) => a.time - b.time)
            document.getElementsByClassName('bottom_button')[1].innerText = "Sort by language";
            document.getElementsByClassName('bottom_button')[1].href = `?role=${role_name}&sort=language`;
        }

        // show the data
        show_role_info(users_data, role_name)
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
    user_data.roles.forEach(role => {
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
    })

    // Display languages
    let lang_string = "Languages spoken:"
    for (var i = 0; i < user_data.languages.length; i++) {
        if (i == user_data.languages.length - 1) {
            // last one
            lang_string += ` ${user_data.languages[i]}`
        } else {
            // adding all spoken languages one by one, space after the comma
            lang_string += ` ${user_data.languages[i]},`
        }
    }
    document.getElementsByClassName('languages')[0].innerText = lang_string

    // Display birthday or hide it
    if (user_data.birthday) {
        document.getElementsByClassName('birthday')[0].innerText = `Birthday: ${user_data.birthday}`
    } else {
        document.getElementsByClassName('birthday')[0].style.display = "none"
    }

    // Display the rest of the data
    document.getElementById("staff_member_name").innerText = user_data.name
    document.getElementsByClassName("list_category")[0].style.display = "none" // role info -> if not a role, disappear
    document.getElementsByClassName("current_info")[0].innerText = "Current status"
}

async function show_role_info(role_joins, role_name) {
    /*
    pre: body is loaded
         role_joins is a list of user objects (keys: name, roles, current, languages, birthday)
         => see get_users_from_role

    post: adds all the data to the "rang" class elements
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

    let current_staff = 0

    role_joins.forEach(user => {

        // Add to updates
        let new_user = document.createElement('div');
        let new_date = document.createElement('div');
        user_to_flags(new_user, user)
        new_date.innerText = unix_to_date(user.time)
        document.getElementsByClassName("rang")[1].appendChild(new_user)
        document.getElementsByClassName("rang")[2].appendChild(new_date)

        // Add to current
        if (user.current != "resigned") {
            document.getElementsByClassName("rang")[0].appendChild(new_user.cloneNode(true)) // clone cause an element can only be in one place
            current_staff++
        }

    })

    // Display data
    document.getElementsByClassName("current_info")[0].innerText = `Current members (${current_staff})`
    document.getElementById("staff_member_name").innerHTML = role_data.display_name
    document.getElementById("staff_member_name").style.color = role_data.colour
    document.getElementsByClassName('role_explanation')[0].innerHTML = role_data.description
}

function show_error(error_num) {
    /*
    pre: body is loaded, error_num is an integer
    post: shows the error on the page
    */
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

    // change bg pfp (might be removed)
    document.getElementsByClassName("artist")[0].innerText = "Jaküm Astrotel#3772"
    document.getElementsByClassName('birthday')[0].style.display = "block"
    document.getElementsByClassName('backgroundImage')[0].style.backgroundImage = "url(Pictures/404.png)"
}