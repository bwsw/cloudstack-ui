import { BasePathPipe } from './base-path.pipe';

describe('base path pipe', () => {
  const basePath = new BasePathPipe();

  it('should preserve empty string', () => {
    expect(basePath.transform('')).toBe('');
  });

  it('should extract base path', () => {
    expect(basePath.transform('/dir1/dir2/dir3/filename')).toBe('filename');
  });
});
