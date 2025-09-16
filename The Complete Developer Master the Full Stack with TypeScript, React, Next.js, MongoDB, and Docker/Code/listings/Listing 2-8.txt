let globalVar = "global";
function scope() {
    let foo = 1;
    if (true) {
        let bar = "2";
    }
    console.log(globalVar);
    console.log(window.globalVar);
    console.log(foo);
    console.log(bar);
}
scope();
