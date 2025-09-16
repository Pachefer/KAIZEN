async function fetchData(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(`Error : ${error}`);
    }
}

fetchData("https://www.usemodernfullstack.dev/api/v1/users");
