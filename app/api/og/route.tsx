import { HOST } from "@/constants/constant";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "My Internet Garden";

  const fontData = await fetch(`${HOST}/fonts/barlow-bold.ttf`).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        tw="flex flex-col justify-between h-full w-full p-20 text-white text-4xl"
        style={{
          backgroundImage: `url(${HOST}/opengraph.png)`,
          fontFamily: "Barlow",
        }}
      >
        <div tw="flex flex-row justify-between">
          <span>blog</span>
          <span style={{ color: "black" }}>wc</span>
        </div>
        <div tw="flex">
          <div tw="flex flex-col">
            <span tw="mb-4 text-6xl">{title}</span>
            <span>wchun.xyz</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Barlow",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
