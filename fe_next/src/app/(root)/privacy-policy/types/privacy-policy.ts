export type TypePrivacyPolicyProp = {
  id: string;
  privacyPolicyTitle: string;
  contentTitle: string;
  mainContents: {
    exist?: boolean;
    email?: string;
    phoneNumble?: string;
    mainContent?: string;
  }[];
};
