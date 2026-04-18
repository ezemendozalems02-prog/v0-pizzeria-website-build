import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

// Called after a banner update to bust Next.js data cache
export async function POST() {
  revalidateTag('banners', 'max')
  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
