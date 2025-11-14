import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Providers } from '@/components/Providers';

// Custom render function that includes providers
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Providers>{children}</Providers>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
