var globalVar = "global";
function scope() {
    var foo = 1;

    if (true) {
        var bar = "2";
    }
    console.log(globalVar);
    console.log(window.globalVar);
    console.log(foo);
    console.log(bar);
}
scope();
