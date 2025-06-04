import { SearchBar } from "@/components/search-bar"
import { ChainStats } from "@/components/stats/chain-stats"
import { LatestActivity } from "@/components/home/latest-activity"
import { ChainDetails } from "@/components/stats/chain-details"
import { LatestBlocks } from "@/components/home/latest-blocks"
import { LatestTransactions } from "@/components/home/latest-transactions"

export default function Home() {
  return (
    <div className="container-fluid mx-auto">
      <SearchBar />
      <ChainStats />
      <ChainDetails />
      
      {/* Latest Blocks and Transactions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LatestBlocks />
        <LatestTransactions />
      </div>
    </div>
  )
}