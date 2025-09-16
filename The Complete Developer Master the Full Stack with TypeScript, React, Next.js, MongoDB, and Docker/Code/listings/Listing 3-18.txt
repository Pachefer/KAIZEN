interface WeatherQueryInterface {
    zipcode: string;
}

type WeatherDetailType = {
    weather: string,
    zipcode: string,
    temp?: number,
};
