/*
export default async function ServerComponentUserList(): Promise<JSX.Element> {
    const API = https://no-starch-oauth-example.cyclic.app/api/v1/users;
    const data = await fetch(API, { cache: 'force-cache' });

    return (
        <ul>{Array.isArray(data) && data.map((item) => <li>{item.name}</li>)}</ul>
    );
}

*/

export default async function ServerComponentUserList(): Promise<JSX.Element> {
  const url = "https://no-starch-oauth-example.cyclic.app/api/v1/users";
  let data: responeItemType[] | [] = [];
  let names: responeItemType[] | [];
  try {
    const response = await fetch(url, { next: { revalidate: 20 } });
    data = (await response.json()) as responeItemType[];
  } catch (err) {
    throw new Error("Failed to fetch data");
  }
  names = data.map((item) => {
    return { id: item.id, name: item.name };
  });

  return (
    <ul>
      {names.map((item) => (
        <li id="{item.id}" key="{item.id}">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
