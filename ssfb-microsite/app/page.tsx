'use client';

import dynamic from 'next/dynamic';

const EntryClient = dynamic(() => import('./EntryClient'), { ssr: false });

export default function Entry() {
  return <EntryClient />;
}
