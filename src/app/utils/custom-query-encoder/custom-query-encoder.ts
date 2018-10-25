import { HttpUrlEncodingCodec } from '@angular/common/http';

// Default QueryEncoder used in URLSearchParams does not encode '+' and '/',
// We have to provide a custom QueryEncoder to encode '+' and '/'
export class CustomQueryEncoder extends HttpUrlEncodingCodec {
  private static encode(v: string): string {
    return encodeURIComponent(v)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/gi, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%3D/gi, '=')
      .replace(/%3F/gi, '?');
  }

  encodeKey(k: string): string {
    return CustomQueryEncoder.encode(k);
  }

  encodeValue(v: string): string {
    return CustomQueryEncoder.encode(v);
  }
}
