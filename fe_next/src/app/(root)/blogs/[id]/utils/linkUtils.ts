export const checkoutOutSideLink = (link: string) => {
  if (!link) return false;
  if (link.startsWith("tel:")) return false;
  if (link.startsWith("mailto:")) return false;
  if (link.startsWith("/forms")) return true;
  if (link.startsWith("/")) return false;
  return true;
};

export const getTarget = (link: string) => {
  return checkoutOutSideLink(link) ? "_blank" : "_self";
};

/**
 * path: /abc/def ==> abc
 */
export const getPrefixOfPath = (path: string) => {
  const pathNameArrs = path.split("/");
  let pathNamePrefix =
    pathNameArrs.length > 1 ? pathNameArrs[1] : pathNameArrs[0];
  // replace all query input to empty string
  pathNamePrefix = pathNamePrefix?.replaceAll(/\?.*/gi, "") || "";
  return pathNamePrefix;
};
