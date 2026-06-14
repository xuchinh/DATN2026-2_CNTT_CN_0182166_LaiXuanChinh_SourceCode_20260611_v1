export type TypeUsagePolicyProp = {
  id: string;
  usagePolicyTitle: string;
  contentTitle?: string;
  mainContents: {
    exist?: boolean;
    rightsTitle?: string;
    rights?: {
      rightContent?: string;
    }[];
    responsibilityTitle?: string;
    responsibilitys?: {
      responsibilityContent?: string;
    }[];
    email?: string;
    phoneNumble?: string;
  }[];
};
