function Func() {
    const response = await fetch('./Members.json')
    const jsonData = await response.json()
    return jsonData
}

console.log(Func())