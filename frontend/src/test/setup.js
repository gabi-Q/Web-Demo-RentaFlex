import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extender expect con los matchers de jest-dom
expect.extend(matchers);

// Limpiar después de cada prueba
afterEach(() => {
  cleanup();
}); 