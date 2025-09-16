import React from "react";

export default function App() {
    interface WeatherProps {
        weather: string;
    }

    type WeatherState = {
        count: number;
    };

    class WeatherComponent extends React.Component<WeatherProps, WeatherState> {
        constructor(props: WeatherProps) {
            super(props);
            this.state = {
                count: 0
            };
        }

        componentDidMount() {
            this.setState({ count: 1 });
        }

        clickHandler(): void {
            this.setState({ count: this.state.count + 1 });
        }

        render() {
            return (
                <h1 onClick={() => this.clickHandler()}>
                    The weather is {this.props.weather}, and the counter shows{" "}
                    {this.state.count}
                </h1>
            );
        }
    }

    return (<WeatherComponent weather="sunny" />);
}
