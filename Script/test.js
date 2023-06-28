async function get_db_from_name(db_name) {
    const response = await fetch(`./data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

async function get_users_from_role(role_name) {
    /* 
    pre: role_name is the name of a role (trialhelper, helper, guardian, etc)
    post: returns a list of names, unix value and current value
    
    Example:
    "guardian" returns [ {name: Lisa, time: 1598006832, current: guardianmanagerhelper}, ...]
    "invalidrolename" returns []
    */
    let list = []

    let role_db = await get_db_from_name("Role")
    let role_data = role_db.find((elmt) => elmt.name == role_name)
    if (!role_data) { return [] } // invalid name, no data
    let role_category = role_data.category

    let data = await get_db_from_name(role_category)
    data.forEach(elmt => {

        // Did this person ever get the role?
        if (elmt[role_name] != null) {
            // Yes, add to list
            list.push({
                name: elmt.name,
                time: elmt[role_name],
                current: elmt.current
            })
        }
    })

    return list
}

function loading() {
    let page_url = new URLSearchParams(window.location.search);
    let member_name = page_url.get('member');
    let role_name = page_url.get('role')
    let language_parameter = page_url.get('language');
    let sort_type = page_url.get('sort');
    get_users_from_role(role_name).then(data => console.log(data))

    if (language_parameter) { // making it case insensitive
        language_parameter = language_parameter.substring(0,1).toUpperCase() + page_url.get('language').substring(1).toLowerCase()
    }

    if (member_name && role_name) {
        // member has priority over role, to avoid conflicts
        role_name = null
    }

    if (role_name) {
        let users_data = get_users_from_role(role_name)

        document.title = "Role info"
        //document.getElementsByClassName('sort_button')[0].style.visibility = "visible";

        if (sort_type == "language") {
            //document.getElementsByClassName('bottom_button')[1].innerText = "Default sorting";
            //document.getElementsByClassName('bottom_button')[1].href = `https://heroes.wolvesville.com/list.html?role=${role_name}`;
        } else {
            //document.getElementsByClassName('bottom_button')[1].href = `https://heroes.wolvesville.com/list.html?role=${role_name}&sort=language`;
            users_data.sort((a,b) => a.name.localeCompare(b.name))
            console.log(users_data)
        }

    }
}