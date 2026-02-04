import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Workaround for Next.js 15 type issue
const doRevalidate = revalidateTag as unknown as (tag: string) => void

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const tags = body.tags as string[]

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ message: 'Tags required' }, { status: 400 })
    }

    for (const tag of tags) {
      doRevalidate(tag)
    }

    return NextResponse.json({ revalidated: true, tags })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
