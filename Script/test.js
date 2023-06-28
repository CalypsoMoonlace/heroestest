async function get_db_from_name(db_name) {
    const response = await fetch(`./data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

get_db_from_name("Discord").then(data => {
    data.forEach(elmt => {
        if (elmt.current != "resigned") {
            console.log(elmt.name)
        }
    })
})

async function get_users_from_role(role_name) {
    /* 
    pre: role_name is the name of a role (trialhelper, helper, guardian, etc)
         -> in theory, "resigned" works too but subject to change

    post: returns a list of names, unix value and current value
    
    Example:
    "guardian" returns [ {name: Lisa, time: 1598006832, current: guardianmanagerhelper}, ...]

    */
    let list = []

    let role_db = await get_db_from_name("Role")
    let role_data = data.find((elmt) => elmt.name == role_name)
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

get_users_from_role("guardianmanager").then(data => console.log(data))