'use client'

import dynamic from 'next/dynamic'

// CesiumJS must run client-side only — it accesses window/WebGL directly
const StippleMap = dynamic(() => import('@/components/StippleMap'), { ssr: false })

export default function Home() {
  return <StippleMap />
}
