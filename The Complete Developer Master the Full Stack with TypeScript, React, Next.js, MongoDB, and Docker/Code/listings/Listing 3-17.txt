interface WeatherProps {
    weather: string;
    zipcode: string;
    temp?: number;
}

const weatherComponent = (props: WeatherProps): string => props.weather;
