"use client";

import { AddressHeader } from "@/components/address/address-header";
import { AddressOverview } from "@/components/address/address-overview";
import { AddressTransactions } from "@/components/address/address-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBox } from "../search-box";
import { TokenTransfers } from "./token-transfers";
import { Filter } from "lucide-react";
import { Button } from "../ui/button";
export function AddressPageContent({ address }: { address: string }) {
    return (
        <div className="container-fluid mx-auto overflow-auto">
            <div className="bg-card w-full py-6 shadow-sm mb-6">
                <div className="w-full md:w-[60%] px-6">
                    <SearchBox />
                </div>
            </div>
            <AddressHeader address={address} />

            <div className="px-4 md:px-6">
                <AddressOverview address={address} />
                <div className=" overflow-auto">
                    <Tabs defaultValue="transactions" className="mt-8">
                        {/* Tabs Header */}
                        <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-start">
                          
                            <div className="flex overflow-x-auto scrollbar-hide w-full lg:w-auto">
                                <TabsList className="flex space-x-2">
                                    <TabsTrigger className="bg-input" value="transactions">
                                        Transactions
                                    </TabsTrigger>
                                    <TabsTrigger className="bg-input" value="internal">
                                        Internal Transactions
                                    </TabsTrigger>
                                    <TabsTrigger className="bg-input" value="token-transfers">
                                        Token Transfers (UCC-20)
                                    </TabsTrigger>
                                    <TabsTrigger className="bg-input" value="analytics">
                                        Analytics
                                    </TabsTrigger>
                                    <TabsTrigger className="bg-input" value="multichain">
                                        Multichain Portfolio
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 lg:mt-0 shrink-0">
                                <Filter className="h-4 w-4 mr-2" />
                                Advanced Filter
                            </Button>
                        </div>

                        {/* Tabs Content */}
                        <TabsContent
                            value="transactions"
                            className="rounded-lg bg-card shadow-sm mt-4 border border-border"
                        >
                            <AddressTransactions address={address} />
                        </TabsContent>
                        <TabsContent
                            value="token-transfers"
                            className="rounded-lg bg-card shadow-sm mt-4 border border-border"
                        >
                            <TokenTransfers address={address} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
    );
}