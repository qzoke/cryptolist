import qs from 'qs';

export function getNewPath(currentPath, newPath, newQs) {
  let [path, queryString] = currentPath.split('?');
  let [...oldParts] = path.split('/').filter(a => a);
  let [...newParts] = newPath.split('/').filter(a => a);

  // Update path
  for (let [index, part] of newParts.entries()) {
    if (part === '*') continue;
    oldParts[index] = part;
  }
  let updatedPath = oldParts.join('/');

  // Update querystring
  let query = qs.parse(queryString || '?', { ignoreQueryPrefix: true });
  let updatedQueryString = qs.stringify(Object.assign({}, query, newQs));

  return `/${updatedPath}?${updatedQueryString}`;
}
