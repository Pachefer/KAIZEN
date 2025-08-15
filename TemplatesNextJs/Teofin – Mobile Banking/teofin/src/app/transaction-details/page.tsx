import {TransactionDetails} from './TransactionDetails';

type Params = {
  params: Promise<{txId: string}>;
};

export default async function CardDetailsPage({params}: Params) {
  const txId = (await params).txId;
  return <TransactionDetails txId={txId} />;
}
