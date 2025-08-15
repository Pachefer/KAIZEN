import {CardDetails} from './CardDetails';

type Params = {
  params: Promise<{cardId: string}>;
};

export default async function CardDetailsPage({params}: Params) {
  const cardId = (await params).cardId;
  return <CardDetails cardId={cardId} />;
}
