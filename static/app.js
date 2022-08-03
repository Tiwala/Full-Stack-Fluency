fetch('/api/trainers')
.then((res) => res.json())
.then((data) => {
    console.log(data);
})

fetch('/api/pokemon')
.then((res) => res.json())
.then((data) => {
    console.log(data);
})