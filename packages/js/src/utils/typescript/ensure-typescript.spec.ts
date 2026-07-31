import { ensurePackage } from '@nx/devkit';
import { ensureTypescript } from './ensure-typescript';

jest.mock('@nx/devkit', () => ({
  ensurePackage: jest.fn(),
}));

const mockEnsurePackage = jest.mocked(ensurePackage);

describe('ensureTypescript', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns a compatible TypeScript module', () => {
    const tsModule = require('typescript');
    mockEnsurePackage.mockReturnValue(tsModule);

    expect(ensureTypescript()).toBe(tsModule);
  });

  it('rejects an incompatible TypeScript module', () => {
    mockEnsurePackage.mockReturnValue({
      version: '7.0.2',
    });

    expect(() => ensureTypescript()).toThrow(
      'Unsupported version of `typescript` detected'
    );
  });
});
