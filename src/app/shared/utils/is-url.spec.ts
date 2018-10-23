import { isUrl } from './is-url';

describe('URL Regex', () => {
  const validHttpUrls = [
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://www.example.com/wpstyle/?p=364',
    'http://a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.com',
    'http://mw1.google.com/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
    'http://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body',
    'http://www.microsoft.xn--comindex-g03d.html.irongeek.com',
    'http://✪df.ws/123',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/',
    'http://userid@example.com',
    'http://userid@example.com/',
    'http://userid@example.com:8080',
    'http://userid@example.com:8080/',
    'http://userid:password@example.com',
    'http://userid:password@example.com/',
    'http://142.42.1.1/',
    'http://142.42.1.1:8080/',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://⌘.ws/',
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://foo.com/(something)?after=parens',
    'http://☺.damowmow.com/',
    'http://code.google.com/events/#&product=browser',
    'http://j.mp',
    'http://foo.bar/?q=Test%20URL-encoded%20stuff',
    'http://مثال.إختبار',
    'http://例子.测试',
    'http://उदाहरण.परीक्षा',
    "http://-.~_!$&'()*+';=:%40:80%2f::::::@example.com",
    'http://1337.net',
    'http://a.b-c.de',
    'http://223.255.255.254',
    'http://example.com?foo=bar',
    'http://example.com#foo',
    'http://example.com.',
    'http://my.web.server/filename.vhd.gz',
    'http://my.web.server/filename.iso',
    'http://cloud.centos.org/centos/7/images/CentOS-7-x86_64-GenericCloud-1508.qcow2',
  ];

  const validHttpsUrls = ['https://www.example.com/foo/?bar=baz&inga=42&quux'];

  const validFtpUrls = ['ftp://foo.bar/baz'];

  it('should validate correct URLs', () => {
    const validUrls = [...validFtpUrls, ...validHttpsUrls, ...validHttpUrls];
    for (const url of validUrls) {
      expect(isUrl(url)).toBeTruthy();
    }
  });

  it('should not validate incorrect URLs', () => {
    const invalidUrls = [
      'http://',
      'http://.',
      'http://..',
      'http://../',
      'http://?',
      'http://??',
      'http://??/',
      'http://#',
      'http://##',
      'http://##/',
      'http://foo.bar?q=Spaces should be encoded',
      '//',
      '//a',
      '///a',
      '///',
      'http:///a',
      'foo.com',
      'rdar://1234',
      'h://test',
      'http:// shouldfail.com',
      ':// should fail',
      'http://foo.bar/foo(bar)baz quux',
      'http://-error-.invalid/',
      'http://-a.b.co',
      'http://a.b-.co',
      'http://123.123.123',
      'http://3628126748',
      'http://.www.foo.bar/',
      'http://.www.foo.bar./',
      'http://go/ogle.com',
      'http://foo.bar/ /',
      'http://google\\.com',
      'http://www(google.com',
      'http://www.example.xn--overly-long-punycode-test-string-test-tests-123-test-test123/',
      'http://www=google.com',
      'https://www.g.com/error\n/bleh/bleh',
      'rdar://1234',
      '/foo.bar/',
      '///www.foo.bar./',
    ];
    for (const url of invalidUrls) {
      expect(isUrl(url)).toBeFalsy();
    }
  });

  it('should validate only urls with FTP protocol', () => {
    const config = { ftp: true };
    for (const url of validFtpUrls) {
      expect(isUrl(url, config)).toBeTruthy();
    }

    const anotherValidUrls = [...validHttpUrls, ...validHttpsUrls];
    for (const url of anotherValidUrls) {
      expect(isUrl(url, config)).toBeFalsy();
    }
  });

  it('should validate only urls with HTTP protocol', () => {
    const config = { http: true };
    for (const url of validHttpUrls) {
      expect(isUrl(url, config)).toBeTruthy();
    }

    const anotherValidUrls = [...validFtpUrls, ...validHttpsUrls];
    for (const url of anotherValidUrls) {
      expect(isUrl(url, config)).toBeFalsy();
    }
  });

  it('should validate only urls with HTTPS protocol', () => {
    const config = { https: true };
    for (const url of validHttpsUrls) {
      expect(isUrl(url, config)).toBeTruthy();
    }

    const anotherValidUrls = [...validFtpUrls, ...validHttpUrls];
    for (const url of anotherValidUrls) {
      expect(isUrl(url, config)).toBeFalsy();
    }
  });

  it('should validate only urls with HTTP and HTTPS protocols', () => {
    const config = { https: true, http: true };
    const httpAndHttpsUrls = [...validHttpsUrls, ...validHttpUrls];
    for (const url of httpAndHttpsUrls) {
      expect(isUrl(url, config)).toBeTruthy();
    }

    for (const url of validFtpUrls) {
      expect(isUrl(url, config)).toBeFalsy();
    }
  });

  it('should validate urls without protocols', () => {
    const config = { https: false, http: false, ftp: false };
    const httpUrls = validHttpUrls.map(el => el.replace('http://', ''));
    const httpsUrls = validHttpsUrls.map(el => el.replace('https://', ''));
    const ftpUrls = validFtpUrls.map(el => el.replace('ftp://', ''));
    const urls = [...httpsUrls, ...httpUrls, ...ftpUrls];
    for (const url of urls) {
      expect(isUrl(url, config)).toBeTruthy();
    }
  });
});
