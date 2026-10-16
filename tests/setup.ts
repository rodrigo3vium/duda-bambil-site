import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom não implementa scrollIntoView — o form usa pra rolar entre as telas.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

/**
 * Polyfill de Web Storage.
 *
 * A partir do Node 24/25 o runtime expõe `localStorage`/`sessionStorage`
 * próprios (Web Storage experimental). Sem `--localstorage-file` válido eles
 * viram um objeto inerte — e esse objeto ganha do Storage do jsdom, deixando
 * `window.localStorage.setItem` como `undefined`. Resultado: todo teste que
 * depende de storage falha por ambiente, não por código.
 *
 * Aqui a gente instala um Storage em memória quando o do ambiente não presta.
 * Vale só pros testes; o site usa o storage real do browser.
 */
class MemoryStorage implements Storage {
  private dados = new Map<string, string>();

  get length(): number {
    return this.dados.size;
  }
  clear(): void {
    this.dados.clear();
  }
  getItem(chave: string): string | null {
    return this.dados.has(chave) ? (this.dados.get(chave) as string) : null;
  }
  key(indice: number): string | null {
    return Array.from(this.dados.keys())[indice] ?? null;
  }
  removeItem(chave: string): void {
    this.dados.delete(chave);
  }
  setItem(chave: string, valor: string): void {
    this.dados.set(chave, String(valor));
  }
  [name: string]: unknown;
}

function instalarStorage(nome: "localStorage" | "sessionStorage") {
  const atual = (globalThis as Record<string, unknown>)[nome] as Storage | undefined;
  if (atual && typeof atual.setItem === "function") return;

  const storage = new MemoryStorage();
  for (const alvo of [globalThis, typeof window !== "undefined" ? window : null]) {
    if (!alvo) continue;
    try {
      Object.defineProperty(alvo, nome, {
        value: storage,
        writable: true,
        configurable: true,
      });
    } catch {
      // ambiente não deixa redefinir — o teste que depender disso vai acusar
    }
  }
}

instalarStorage("localStorage");
instalarStorage("sessionStorage");
