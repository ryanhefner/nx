import { typescriptVersion } from '../plugins/js/versions';

const requiredCompilerApis = [
  'createCompilerHost',
  'createModuleResolutionCache',
  'parseJsonConfigFileContent',
  'readConfigFile',
  'resolveModuleName',
] as const;

/**
 * TypeScript 7 no longer exposes the compiler APIs Nx uses from the package's
 * main entry point. Detect that incompatible module shape before an individual
 * call fails with an opaque "<method> is not a function" error.
 */
export function assertCompatibleTypeScript(
  tsModule: unknown
): asserts tsModule is typeof import('typescript') {
  const moduleExports = tsModule as Record<string, unknown>;
  const missingCompilerApis = requiredCompilerApis.filter(
    (api) => typeof moduleExports?.[api] !== 'function'
  );

  if (missingCompilerApis.length === 0) {
    return;
  }

  const installedVersion =
    typeof moduleExports?.version === 'string'
      ? moduleExports.version
      : 'unknown';

  throw new Error(
    `Unsupported version of \`typescript\` detected.\n\n` +
      `  Installed: ${installedVersion}\n\n` +
      `This version does not expose compiler APIs that Nx requires:\n` +
      `  ${missingCompilerApis.join(', ')}\n\n` +
      `Install a compatible TypeScript version (for example, \`typescript@${typescriptVersion}\`), then run \`nx reset\`.`
  );
}

export function loadTypeScript(): typeof import('typescript') {
  const tsModule: unknown = require('typescript');
  assertCompatibleTypeScript(tsModule);
  return tsModule;
}
