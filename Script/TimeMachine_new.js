async function get_users_from_role(role_name, timestamp) {
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

            // Get the last role the user had BEFORE the timestamp
            last_role = ""
            last_stamp = 0
            Object.keys(elmt).forEach(role => {
                elmt[role].toString().split(" ").forEach(time => { // in case of several values for a role
                    if (time < timestamp && time > last_stamp) {
                        last_role = role;
                        last_stamp = time;
                    }
                })
            })
            console.log(elmt)
            console.log(last_role,last_stamp)

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