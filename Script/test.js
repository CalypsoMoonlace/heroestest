async function Func() {
    const response = await fetch('./Members.json')
    const jsonData = await response.json()
    return jsonData
}

(Func().then(data => console.log(data))