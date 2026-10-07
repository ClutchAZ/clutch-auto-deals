import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Call after changing deals, brands or images in Wix to publish immediately
// instead of waiting for the 15-minute refresh:
//   https://www.clutchautodeals.com/api/revalidate?secret=YOUR_SECRET
export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("wix", "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, refreshed: new Date().toISOString() });
}
