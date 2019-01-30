export class Constants {
  /**
   * Max length 255 for some entities fields
   */
  public static readonly maxLength255 = 255;

  /**
   * The first symbol is a letter , further all symbols except comma
   */
  public static readonly entityValidator = '^\\pL{1}[^,]*[\\S]$';

  public static readonly dialogSizes = {
    dialogSize650: '650px',
  };
}
