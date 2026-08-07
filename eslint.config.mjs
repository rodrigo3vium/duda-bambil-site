import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// O repo não tinha ESLint configurado (`next lint` caía no wizard interativo e
// está deprecado no Next 16). Config flat mínima com as regras do Next.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
