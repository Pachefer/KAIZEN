function welcome(name) {
    if (name === null) {
        return "Welcome!";
    }
    return "Welcome, ".concat(name, "!");
}
console.log(welcome("John"));
console.log(welcome(null));
