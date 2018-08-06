export const getPairFromMatch = ({ path, url }) => {
  const quoteStr = ':quote';
  const baseStr = ':base';
  const quoteIndex = path.split('/').indexOf(quoteStr);
  const baseIndex = path.split('/').indexOf(baseStr);
  const quote = url.split('/')[quoteIndex];
  const base = url.split('/')[baseIndex];

  return { quote, base };
};
