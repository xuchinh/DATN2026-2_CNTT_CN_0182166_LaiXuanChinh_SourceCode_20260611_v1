export type TypeOffersItemProp = {
    _id: string;
    code: string;
    name: string;
    description: string;
    discountPercentage: string;
    discountCurrency: string;
    deletedAt: Date;
    isActive: boolean;
    condition: number;
};

// export interface TypeOffersItemProp {
//     id?: string;
//     code?: string;
//     name: string;
//     description?: string;
//     isActive: boolean;
//     discountPercentage?: number;
//     discountAmount?: string;
//     discountCurrency?: string;
//     minSubscriptionMonths: number;
//     deletedAt?: string;
// }
