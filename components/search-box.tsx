"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchWithCors, REST_API_URL, RPC_API_URL } from "@/lib/api-utils";

interface SearchResult {
  type: 'transaction' | 'block' | 'address';
  hash?: string;
  height?: number;
  status?: string;
  time?: string;
  gasUsed?: string;
  gasWanted?: string;
  fee?: string;
  txCount?: number;
  from?: string;
  to?: string;
  amount?: string;
}

export function SearchBox() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All filters");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filters = ["All filters", "Transactions", "Blocks", "Addresses"];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const searchTransactionsByAddress = async (address: string) => {
    const events = [
      `message.sender='${address}'`,
      `transfer.recipient='${address}'`,
    ].map(event => encodeURIComponent(event));

    const results: SearchResult[] = [];

    for (const event of events) {
      try {
        const response = await fetchWithCors(
          `${REST_API_URL}/cosmos/tx/v1beta1/txs?events=${event}&order_by=ORDER_BY_DESC&limit=5`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.tx_responses) {
            const transactions = data.tx_responses.map((tx: any) => {
              const msg = tx.tx.body.messages[0];
              const msgType = msg["@type"].split(".").pop() || "Unknown";
              
              let from = "", to = "", amount = "";
              if (msgType === "MsgSend") {
                from = msg.from_address;
                to = msg.to_address;
                if (msg.amount && msg.amount.length > 0) {
                  const value = parseInt(msg.amount[0].amount) / Math.pow(10, 18);
                  amount = `${value} ${msg.amount[0].denom.replace('a', '')}`;
                }
              }

              return {
                type: 'transaction',
                hash: tx.txhash,
                height: parseInt(tx.height),
                status: tx.code === 0 ? "Success" : "Failed",
                time: tx.timestamp,
                from,
                to,
                amount
              };
            });
            
            results.push(...transactions);
          }
        }
      } catch (error) {
        console.error("Error searching transactions by address:", error);
      }
    }

    return results;
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    setShowResults(true);
    setSearchResults([]);
    
    try {
      const results: SearchResult[] = [];
      
      // Check if search query is a transaction hash
      if ((selectedFilter === "All filters" || selectedFilter === "Transactions") && 
          (searchQuery.length > 40)) {
        try {
          const response = await fetchWithCors(`${REST_API_URL}/cosmos/tx/v1beta1/txs/${searchQuery}`);
          
          if (response.ok) {
            const data = await response.json();
            const txResponse = data.tx_response;
            const msg = txResponse.tx.body.messages[0];
            
            results.push({
              type: 'transaction',
              hash: txResponse.txhash,
              height: parseInt(txResponse.height),
              status: txResponse.code === 0 ? "Success" : "Failed",
              time: txResponse.timestamp,
              gasUsed: txResponse.gas_used,
              gasWanted: txResponse.gas_wanted,
              from: msg.from_address,
              to: msg.to_address,
              amount: msg.amount ? `${parseInt(msg.amount[0].amount) / Math.pow(10, 18)} ${msg.amount[0].denom.replace('a', '')}` : undefined
            });
          }
        } catch (error) {
          console.log("Not a valid transaction hash");
        }
      }
      
      // Check if search query is a block height
      if ((selectedFilter === "All filters" || selectedFilter === "Blocks") && 
          (!isNaN(parseInt(searchQuery)))) {
        try {
          const blockHeight = parseInt(searchQuery);
          const response = await fetchWithCors(`${RPC_API_URL}/block?height=${blockHeight}`);
          
          if (response.ok) {
            const data = await response.json();
            const block = data.result.block;
            
            results.push({
              type: 'block',
              height: blockHeight,
              time: block.header.time,
              txCount: block.data.txs ? block.data.txs.length : 0
            });
          }
        } catch (error) {
          console.log("Not a valid block height");
        }
      }

      // Check if search query is an address
      if ((selectedFilter === "All filters" || selectedFilter === "Addresses") && 
          (searchQuery.startsWith('ucc'))) {
        const addressResults = await searchTransactionsByAddress(searchQuery);
        results.push(...addressResults);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const viewSearchResult = (result: SearchResult) => {
    if (result.type === 'transaction' && result.hash) {
      router.push(`/tx/${result.hash}`);
    } else if (result.type === 'block') {
      router.push(`/block/${result.height}`);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center w-full bg-yellow-500 rounded-lg shadow-md p-0.5">
        <div className="bg-white relative flex items-center w-full p-1 rounded-lg">
          <div className="relative flex-shrink-0">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 text-xs font-light text-black bg-white rounded-l-md focus:outline-none"
            >
              {selectedFilter} <span>&#9662;</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-white shadow-md rounded-md z-10">
                {filters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => selectFilter(filter)}
                    className="w-full px-4 py-2 text-left text-sm text-black hover:bg-yellow-200 focus:outline-none"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Input
            placeholder="Search by transaction hash, block height, or address..."
            className="flex-grow border-none rounded-none bg-white text-black pl-4 py-2 text-sm"
            value={searchQuery}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
          />

          <button 
            className="flex items-center justify-center mr-1 p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
            onClick={handleSearch}
          >
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {showResults && (
        <Card className="absolute w-full mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            {isSearching ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Search Results</h3>
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="border-b pb-3 cursor-pointer hover:bg-muted p-2 rounded-md"
                    onClick={() => viewSearchResult(result)}
                  >
                    {result.type === 'transaction' ? (
                      <>
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">Transaction</div>
                          <div className={`text-xs ${
                            result.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          } rounded-full px-2 py-0.5`}>
                            {result.status}
                          </div>
                        </div>
                        <div className="font-mono text-sm truncate max-w-[100%] mt-1">
                          {result.hash}
                        </div>
                        {result.from && result.to && (
                          <div className="mt-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">From:</span>
                              <span className="font-mono">{result.from}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">To:</span>
                              <span className="font-mono">{result.to}</span>
                            </div>
                            {result.amount && (
                              <div className="flex justify-between mt-1">
                                <span className="text-muted-foreground">Amount:</span>
                                <span>{result.amount}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">Block</div>
                          <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                            {result.txCount} Txs
                          </div>
                        </div>
                        <div className="font-mono text-sm mt-1">
                          Height: {result.height}
                        </div>
                      </>
                    )}
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <div>{result.type === 'transaction' ? `Block: ${result.height}` : ''}</div>
                      <div>{result.time ? new Date(result.time).toLocaleString() : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No results found matching &quot;{searchQuery}&quot;</p>
                <p className="text-xs mt-2">Try searching for a transaction hash, block height, or address</p>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowResults(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}