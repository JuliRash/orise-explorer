import dynamic from 'next/dynamic';
import { SearchBox } from "@/components/search-box"

// Use dynamic import for the client component
const BlockDetailClient = dynamic(() => 
  import('@/components/block/block-detail').then(mod => ({ 
    default: mod.BlockDetail 
  })),
  { ssr: true }
);

// This function is essential for Next.js static site generation with dynamic routes
export function generateStaticParams() {
  // Return empty array for static export
  return []
}

// Use an async page component since TypeScript expects params to be a Promise
export default async function Page({ params }: { params: { height: string } }) {
  // Using await with Promise.resolve to make TypeScript happy
  const resolvedHeight = await Promise.resolve(parseInt(params.height));
  
  return (
    <div className="container-fluid mx-auto">
      <div className="bg-card w-full py-6 shadow-sm mb-6">
        <div className="w-full md:w-[60%] px-6">
          <SearchBox />
        </div>
      </div>

      <div className="px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Block #{resolvedHeight}</h1>
        <BlockDetailClient height={resolvedHeight} />
      </div>
    </div>
  )
} 