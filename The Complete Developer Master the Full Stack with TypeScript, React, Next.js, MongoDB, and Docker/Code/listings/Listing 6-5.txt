export const resolvers = {
    Query: {
        weather: async (_: any, param: WeatherInterface) => {
            return [
                {
                    zip: param.zip,
                    weather: "sunny",
                    tempC: "25C",
                    tempF: "70F",
                    friends: []
                }
            ];
        },
    },
    Mutation: {
        weather: async (_: any, param: { data: WeatherInterface }) => {
            return [
                {
                    zip: param.data.zip,
                    weather: "sunny",
                    tempC: "25C",
                    tempF: "70F",
                    friends: []
                }
            ];
        }
    },
};
