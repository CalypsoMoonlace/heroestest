import data from './Members.json' assert { type: 'json' };

function Func() {
    fetch('./Members.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
}

Func()