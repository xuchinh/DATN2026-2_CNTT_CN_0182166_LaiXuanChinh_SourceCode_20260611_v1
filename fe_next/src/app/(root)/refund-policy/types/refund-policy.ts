export type TypeRefundPolicyProp = {
  id: string;
  refundPolicyTitle: string;
  contentTitle: string;
  spanContentTitle?: string;
  mainContents: {
    exist?: boolean;
    email?: string;
    phoneNumble?: string;
    mainContent?: string;
  }[];
};
