export class Truncate {
  public static clip(text: string, length: number): string {
    return Truncate.ellipsis(text, length, '');
  }

  public static ellipsis(text: string, length: number, ending: string = '...'): string {
    if (text.length < length) {
      return text;
    }
    return text.slice(0, length - ending.length) + ending;
  }

  public static macStyle(text: string, length: number, opt: { endPartLength?: number} = {}): string {
    if (text.length < length) {
      return text;
    }
    if (length < 5) {
      throw new Error('Truncate.macStyle: the desired length can not be less 5')
    }

    const ellipsisLength = 3;
    const endPartLength = opt.endPartLength >= 0 ?
      Math.floor(opt.endPartLength) : Math.floor((length - ellipsisLength) / 2);
    const initialPartLength = length - ellipsisLength - endPartLength;

    return text.slice(0, initialPartLength) + '...' + text.slice(-endPartLength);
  }

}

export function truncate(text: string, length: number, ending: string = '...') {
  return ''
}
