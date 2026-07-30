import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Proxies GET requests to the user-configured Google Apps Script endpoint.
 * The Apps Script URL is passed as a query param (?url=) rather than
 * hardcoded, since it is configurable from Settings.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing 'url' query parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "The configured API URL is not valid." }, { status: 400 });
  }

  if (parsed.hostname !== "script.google.com" && parsed.hostname !== "script.googleusercontent.com") {
    return NextResponse.json(
      { error: "Only Google Apps Script endpoints are allowed." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `The Google Sheet endpoint responded with status ${upstream.status}.` },
        { status: 502 },
      );
    }

    const text = await upstream.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "The Google Sheet endpoint did not return valid JSON." },
        { status: 502 },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not reach the Google Sheet endpoint. Check your connection." },
      { status: 502 },
    );
  }
}
