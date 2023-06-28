async function get_db_from_name(db_name) {
    const response = await fetch(`./data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

get_db_from_name("Discords").then(data => {
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

    get_db_from_name("Roles").then(data => {
        console.log(data)
        let role_data = data[role_name]
        let role_category = role_data.category
        console.log(role_category)

        get_db_from_name(role_category).then(data => {
            data.forEach(elmt => {
                if (elmt.role_name != null) {
                    list.push({
                        name: elmt.name,
                        time: elmt[role_name],
                        current: elmt.current
                    })
                }
            })
        })
    })

    return list
}

get_users_from_role("helper").then(data => console.log(data))