const url = require('url');
const httpRequest = require('http').request;
const httpsRequest = require('https').request;

const urlToOption = ({ protocol, hostname, hash, search, pathname, href, port, username, password }) => {
  const option = { protocol, hostname, hash, search, pathname, href, path: `${pathname}${search}` };
  if (port !== '') option.port = Number(port);
  if (username || password) option.auth = `${username}:${password}`;
  return option;
};

const request = (urlString, { data: searchObject, content: body, stream, writeStream, ...extra }) => new Promise((resolve, reject) => {
  if (stream || writeStream) throw new Error('[slimUrllib] unsupported option', { stream, writeStream });

  const option = urlToOption(new url.URL(urlString));
  if (searchObject) option.search = new url.URLSearchParams(searchObject).toString();

  // console.log('[slimUrllib] request:', { ...option, ...extra });

  const request = (option.protocol === 'https:' ? httpsRequest : httpRequest)({ ...option, ...extra });

  request.on('error', (error) => {
    console.warn('[slimUrllib] request error:', error);
    reject(error);
  });

  request.on('response', (response) => {
    // console.log('[slimUrllib] response:', response);
    const chunkList = [];
    response.on('error', reject);
    response.on('data', (chunk) => chunkList.push(chunk));
    response.on('end', () => {
      response.removeListener('error', reject);
      const { statusCode, headers } = response;
      const data = Buffer.concat(chunkList);
      const res = { status: statusCode, statusCode, headers, data, size: data.length }
      resolve({ ...res, res });
    });
  });

  request.end(body);
});

module.exports = { request };
