export const typeDefs = gql`

    type FriendsType {
        zip: String!
        weather: String!
    }

    type LocationWeatherType {
        zip: String!
        weather: String!
        tempC: String!
        tempF: String!
        friends: [FriendsType]!
    }

    type Query {
        weather(zip: String): [LocationWeatherType]!
    }
    
`;
