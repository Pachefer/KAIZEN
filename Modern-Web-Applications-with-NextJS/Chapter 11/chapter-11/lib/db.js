import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  MONGODB_URI='mongodb+srv://shubhamJain:ZbJcz3dJ88LSUMlM@cluster0.ntrwp.mongodb.net/auth-demo?retryWrites=true&w=majority';
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  // const client = await MongoClient.connect(
  //   'mongodb+srv://shubhamJain:ZbJcz3dJ88LSUMlM@cluster0.ntrwp.mongodb.net/auth-demo?retryWrites=true&w=majority'
  // );

  return client;
}
