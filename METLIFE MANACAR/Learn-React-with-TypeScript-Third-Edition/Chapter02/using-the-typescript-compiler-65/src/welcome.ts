function welcome(name: string | null) {
  if (name === null) {
    return `Welcome!`;
  }
  return `Welcome, ${name}!`;
}
console.log(welcome("John"));
console.log(welcome(null));
