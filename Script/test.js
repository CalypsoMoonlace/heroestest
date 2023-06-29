// text_to_flag is temporary and should be replaced by static files to ensure it remains functional at all times

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
    post: returns an object with "roles", "current" and "languages" as keys 
          -> "roles" is a list of {name, time} objects corresponding to when a role was obtained
          -> the values are split so that if there are two unix values, they are shown separately
          -> it is sorted by time
          -> "current" is a list of strings that are the current role(s) the user has
          -> "languages" is a list of strings of the languages the user speaks
    
    Example:
    "Sonblo" returns { roles: [ {name: "trialhelper", time: 1547856000}, {name: "helper", time: 1548587013}, ... ], 
                       current: ["mod", "mentor"],
                       languages: ["English", "Dutch"]
                     }
    "Boon" returns { roles: [ {name: "trialhelper", time: 1542932401}, {name: "trialhelper", time: 1583085566}, ... ],
                     current: ["resigned"],
                     languages: ["English", "Thai"]
                   }
    "invalid_user_name" returns { roles: [], current: [], languages: []}
    */
    let result = { roles: [], current: [], languages: [] }

    // Find which db to look into
    let member_db = await get_db_from_name("Member")
    let member_data = member_db.find((elmt) => elmt.name == user_name)
    if (!member_data) { return result } // invalid name, no data
    let member_categories = member_data.categories.split(" ") // eg: member_categories = ["Discord", "Mentor"]
    result.languages = member_data.languages.split(" ") // eg: results.languages = ["English", "French", "German"]

    for (var i = 0; i < member_categories.length; i++) {
        
        // Add category by category
        let category_db = await get_db_from_name(member_categories[i])
        let category_data = category_db.find((elmt) => elmt.name == user_name)

        Object.keys(category_data).forEach(key => {
            // Add all keys with data
            if (typeof(category_data[key]) == "number") { // one entry
                result.roles.push({
                    name: key,
                    time: category_data[key]
                })
            }

            if (typeof(category_data[key]) == "string" && key != "languages" && key != "current" && key != "name") { // two or more entries, avoid fields that aren't time
                category_data[key].split(" ").forEach(entry => {
                    result.roles.push({
                        name: key,
                        time: parseInt(entry)
                    })
                })
            }
        })

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

        // sort accordingly
        if (sort_type == "language") {
            users_data.sort((a,b) => a.languages.localeCompare(b.languages))
        } else if (sort_type == "name") {
            users_data.sort((a,b) => a.name.localeCompare(b.name))
        } else { 
            // default = sort by date
            users_data.sort((a,b) => a.time - b.time)
        }

        // show the data
        show_role_info(users_data)
    }

    if (member_name) {
        // load user info
        document.title = "User info"
        roles_data = await get_roles_from_user(member_name)
        console.log(roles_data)

        // show the data
        show_user_info(roles_data)
    }
}

function user_to_flags(html_parent, user_data) {
    /*
    pre: html_parent is a HTML element, user_data is a user object (keys: name, roles, current, languages)
    post: adds text & a link to the user page and displays the flags next to the name
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
        temp_img.src = text_to_flag[language]
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
    role_html.innerText = role_data.display_name
    role_html.href = `?role=${role_name}`
    role_html.classList = "role_link"
    role_html.style.color = role_data.colour

    // Add changes
    html_parent.appendChild(role_html)
}

function show_user_info(roles_data) {
    /*
    pre: body is loaded
         roles_data is an object (keys: roles, current, languages)
         => roles is a list of objects (keys: name, time)
         => current & languages are a list of strings
         => see get_roles_from_user

    post: adds all the data to the "rang" class elements
          doesn't return anything
    */
    // Get info from role db
    let role_db = get_db_from_name("Role")

    // Add current roles
    roles_data.current.forEach(role => {
        // Create role item container
        let new_role = document.createElement('div')

        // Create role item
        role_to_link(new_role, role, role_db)

        // Append
        document.getElementsByClassName("rang")[0].appendChild(new_role)
    })

    // Add role history
    roles_data.roles.forEach(role => {
        // Create role item container
        let new_role = document.createElement('div')

        // Create role item
        role_to_link(new_role, role.name, role_db)

        // Create role date
        let new_date = document.createElement('div');
        new_date.innerText = unix_to_date(role.time)

        // Append
        document.getElementsByClassName("rang")[1].appendChild(new_role)
        document.getElementsByClassName("rang")[2].appendChild(new_date)
    })

    document.getElementsByClassName("current_info")[0].innerText = `Current status`
}

function show_role_info(users_data) {
    /*
    pre: body is loaded
         users_data is a list of user objects (keys: name, roles, current, languages)
         => see get_users_from_role

    post: adds all the data to the "rang" class elements
          doesn't return anything
    */
    let current_staff = 0

    users_data.forEach(user => {

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

    document.getElementsByClassName("current_info")[0].innerText = `Current members (${current_staff})`
}