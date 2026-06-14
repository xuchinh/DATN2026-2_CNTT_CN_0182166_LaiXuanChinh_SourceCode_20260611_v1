export type TypePriceItemProp = {
  _id: string;
  code: string;
  name: string;
  description: string;
  price?: string;
  isActive: boolean;
  features: string[];
  totalBuilding: string;
};

export interface TypeOffersItemProp {
  _id: string;
  code: string;
  name: string;
  description: string;
  discountPercentage: string;
  discountCurrency: string;
  deletedAt: Date;
  isActive: boolean;
  condition: number;
}
export interface TypeFeatureProp {
  _id: string
  code: string;
  name: string;
  systemRoles: string;
  path: string;
  description: string;
  displayName: string;
  menuCode: string;
}