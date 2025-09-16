import { NextResponse, NextRequest } from "next/server";

type RequestParams = {
  zipcode: string;
};

export async function GET(
  req: NextRequest,
  context: { params: RequestParams }
): Promise<NextResponse> {
  return NextResponse.json(
    {
      zipcode: context.params.zipcode,
      weather: "sunny",
      temp: 35,
    },
    { status: 200 }
  );
}
