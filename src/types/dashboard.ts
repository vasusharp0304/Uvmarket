export interface Signal {
    id: string;
    symbol: string;
    companyName: string;
    segment: string;
    signalType: string;
    direction: string;
    entryPrice: number;
    targetPrice: number;
    stopLossPrice: number;
    exitPrice: number | null;
    status: string;
    returnPercent: number | null;
    notes: string | null;
    entryDateTime: string;
    exitDateTime: string | null;
    createdAt: string;
    screenshots?: { id: string; imageUrl: string; }[];
}

export interface Stats {
    totalTrades: number;
    winners: number;
    losers: number;
    avgReturn: number;
    winRate: number;
}
