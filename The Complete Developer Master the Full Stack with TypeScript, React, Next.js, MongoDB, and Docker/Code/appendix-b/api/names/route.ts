import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = "https://no-starch-oauth-example.cyclic.app/api/v1/users";
  let data;
  try {
    const response = await fetch(url);
    data = (await response.json()) as responeItemType[];
  } catch (err) {
    return NextResponse.json(undefined, { status: 500 });
  }
  const names = data.map((item) => {
    return { id: item.id, name: item.name };
  });
  return NextResponse.json(names, { status: 200 });
}
