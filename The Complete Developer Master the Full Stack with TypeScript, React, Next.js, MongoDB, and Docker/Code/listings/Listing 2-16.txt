function fetchData(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => {
            console.error(`Error : ${error}`);
        });
}

fetchData("https://www.usemodernfullstack.dev/api/v1/users");
