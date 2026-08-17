import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Extend the Next.js config that already has jsx-a11y plugin with additional recommended rules
const nextConfigWithA11y = nextVitals.map(cfg => {
  if (cfg.plugins?.["jsx-a11y"]) {
    return {
      ...cfg,
      rules: {
        ...cfg.rules,
        "jsx-a11y/anchor-has-content": "warn",
        "jsx-a11y/anchor-is-valid": "warn",
        "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
        "jsx-a11y/aria-role": "warn",
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/heading-has-content": "warn",
        "jsx-a11y/html-has-lang": "warn",
        "jsx-a11y/img-redundant-alt": "warn",
        "jsx-a11y/interactive-supports-focus": "warn",
        "jsx-a11y/label-has-associated-control": "warn",
        "jsx-a11y/mouse-events-have-key-events": "warn",
        "jsx-a11y/no-access-key": "warn",
        "jsx-a11y/no-noninteractive-element-interactions": "warn",
        "jsx-a11y/no-noninteractive-tabindex": "warn",
        "jsx-a11y/no-redundant-roles": "warn",
        "jsx-a11y/no-static-element-interactions": "warn",
        "jsx-a11y/tabindex-no-positive": "warn",
      },
    };
  }
  return cfg;
});

const eslintConfig = defineConfig([
  ...nextConfigWithA11y,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
