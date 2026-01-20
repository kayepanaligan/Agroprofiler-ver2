export type Commodity = {
    name: string;
    count: number;
};

export type CommodityCategory = {
    name: string;
    commodities: Commodity[];
};
