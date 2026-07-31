import {
  assertCompatibleTypeScript,
  loadTypeScript,
} from './typescript-version';

describe('TypeScript compatibility', () => {
  it('accepts the supported TypeScript compiler API', () => {
    expect(() => loadTypeScript()).not.toThrow();
  });

  it('reports an actionable error when compiler APIs are unavailable', () => {
    expect(() =>
      assertCompatibleTypeScript({
        version: '7.0.2',
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Unsupported version of \`typescript\` detected.

        Installed: 7.0.2

      This version does not expose compiler APIs that Nx requires:
        createCompilerHost, createModuleResolutionCache, parseJsonConfigFileContent, readConfigFile, resolveModuleName

      Install a compatible TypeScript version (for example, \`typescript@~6.0.3\`), then run \`nx reset\`."
    `);
  });

  it('reports only the missing compiler APIs', () => {
    expect(() =>
      assertCompatibleTypeScript({
        createCompilerHost: () => {},
        createModuleResolutionCache: () => {},
        parseJsonConfigFileContent: () => {},
        readConfigFile: undefined,
        resolveModuleName: () => {},
        version: '7.0.2',
      })
    ).toThrow('Nx requires:\n  readConfigFile');
  });
});
