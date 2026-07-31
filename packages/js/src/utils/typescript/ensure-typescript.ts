import { ensurePackage } from '@nx/devkit';
import { assertCompatibleTypeScript } from 'nx/src/utils/typescript-version';
import { typescriptVersion } from '../versions';

export function ensureTypescript() {
  const tsModule = ensurePackage<typeof import('typescript')>(
    'typescript',
    typescriptVersion
  );
  assertCompatibleTypeScript(tsModule);
  return tsModule;
}
