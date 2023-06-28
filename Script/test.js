function Func() {
    fetch('./Members.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
}

Func()