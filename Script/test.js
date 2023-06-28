async function Func() {
    const response = await fetch('./Members.json')
    const jsonData = await response.json()
    return jsonData
}

Func().then(data => {
    data.forEach(elmt => {
        if (elmt.name.includes('A')) {
            console.log(elmt)
        }
    })
})