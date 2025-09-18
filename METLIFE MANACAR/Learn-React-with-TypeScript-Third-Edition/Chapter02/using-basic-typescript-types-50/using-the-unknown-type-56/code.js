fetch("https://swapi.dev/api/people/1")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    if (isCharacter(data)) {
        console.log("name", data.name);
    }
});
function isCharacter(character) {
    return "name" in character;
}
