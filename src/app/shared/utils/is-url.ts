/*
 * This is based on regex by Diego Perini
 * https://gist.github.com/dperini/729294
 *
 *  Notes on possible differences from a standard/generic validation:
 * - utf-8 char class take in consideration the full Unicode range
 * - TLDs have been made mandatory so single names like "localhost" fails
 * - protocols have been restricted to ftp, http and https only as requested
 *
 * Changes:
 * - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
 *   first and last IP address of each class is considered invalid
 *   (since they are broadcast/network addresses)
 * - Added exclusion of private, reserved and/or local networks ranges
 * - Made starting path slash optional (http://example.com?foo=bar)
 * - Allow a dot (.) at the end of hostnames (http://example.com.)
 *
 *
 * Information above provided from original gist
 */

export interface UrlConfig {
  https?: boolean;
  http?: boolean;
  ftp?: boolean;
}

const defaultConfig = {
  https: true,
  http: true,
  ftp: true,
};

const urlWithoutProtocolPart =
  // user:pass authentication
  '(?:\\S+(?::\\S*)?@)?' +
  '(?:' +
  // IP address exclusion
  // private & local networks
  '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
  '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
  '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broacast addresses
  // (first & last IP address of each class)
  '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
  '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
  '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
  '|' +
  // host name
  '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
  // domain name
  '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
  // TLD identifier
  '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
  // TLD may end with dot
  '\\.?' +
  ')' +
  // port number
  '(?::\\d{2,5})?' +
  // resource path
  '(?:[/?#]\\S*)?' +
  '$';

export function isUrl(url: string, config: UrlConfig = defaultConfig): boolean {
  const http = config.http ? 'http' : null;
  const https = config.https ? 'https' : null;
  const ftp = config.ftp ? 'ftp' : null;

  const protocols = [http, https, ftp].reduce((total, protocol) => {
    if (protocol) {
      return total.length > 0 ? `${total}|${protocol}` : protocol;
    }
    return total;
  }, '');

  const protocolPart = protocols ? `(?:(?:${protocols})://)` : '';

  const urlRegex = new RegExp(`^${protocolPart}${urlWithoutProtocolPart}`, 'i');

  return urlRegex.test(url);
}
