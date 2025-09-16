import React from "react";

export default function App() {

    interface WeatherProps {
        weather: string;
    }

    const clickHandler = (text: string): void => {
        alert(text);
    };

    const WeatherComponent = (props: WeatherProps): JSX.Element => {
        const text = `The weather is ${props.weather}`;
        return (<h1 onClick={() => clickHandler(text)}>{text}</h1>);
    };

    return (<WeatherComponent weather="sunny" />);
}
