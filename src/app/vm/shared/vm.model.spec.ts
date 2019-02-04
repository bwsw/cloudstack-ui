import { isVMUserDataValid } from './vm.model';

describe('VM model', () => {
  describe('isVMUserDataValid', () => {
    it('should be valid for empty string', () => {
      expect(isVMUserDataValid('')).toBeTruthy();
    });

    it('should be valid', () => {
      expect(isVMUserDataValid('#'.repeat(15000))).toBeTruthy();
    });

    it('should be invalid', () => {
      expect(isVMUserDataValid('#'.repeat(20000))).toBeFalsy();
    });
  });
});
