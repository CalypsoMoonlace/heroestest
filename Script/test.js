async function get_db_from_name(db_name) {
    const response = await fetch(`./Script/data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

async function get_users_from_role(role_name) {
    /* 
    pre: role_name is the name of a role (trialhelper, helper, guardian, etc)
    post: returns a list of names, unix value and current value
    
    Example:
    "guardian" returns [ {name: Lisa, time: 1598006832, current: "guardianmanagerhelper"}, ...]
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
                languages: elmt.languages
            })
        }
    })

    return list
}

async function get_roles_from_user(user_name) {
    /* 
    pre: user_name is the name of a user (Lisa, Arnaud, etc)
    post: returns an object with "roles" and "current" as keys 
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
    let date = new Date(list_to_add[i]*1000); // from unix to object
    
    day = date.getDate()
    if (day<10) {
        day = "0" + day
    }

    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    month = months[date.getMonth()] // going from number to string

    year = temp_time.getYear() + 1900

    result = day + " " + month + " " + year
    return result
}

async function loading() {
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
        console.log(users_data)
        show_role_info(users_data)
    }

    if (member_name) {
        // load user info
        document.title = "User info"
        roles_data = await get_roles_from_user(member_name)
        console.log(roles_data)
    }
}

function show_role_info(users_data) {
    let current_staff = 0

    for (var i = 0; i < users_data.length; i++) {
        // Add to updates
        let new_user = document.createElement('div');
        let new_date = document.createElement('div');
        new_user.innerText = users_data[i].name
        new_date.innerText = unix_to_date(users_data[i].time)
        document.getElementsByClassName("rang")[1].appendChild(new_user)
        document.getElementsByClassName("rang")[2].appendChild(new_date)

        // Add to current
        if (users_data[i].current != "resigned") {
            document.getElementsByClassName("rang")[0].appendChild(new_user)
            current_staff++
        }
    }

    document.getElementsByClassName("current_info")[0].innerText = `Current members (${current_staff})`
}