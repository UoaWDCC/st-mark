export const getValidLink = (link: string): string => {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `http://${link}`;
};
