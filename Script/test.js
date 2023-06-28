async function get_db_from_name(db_name) {
    const response = await fetch(`./data/${db_name}.json`)
    const jsonData = await response.json()
    return jsonData
}

get_db_from_name("Discords").then(data => {
    data.forEach(elmt => {
        if (elmt.current != "resigned") {
            console.log(elmt)
        }
    })
})