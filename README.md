# @ted2xmen/hooks

A collection of custom React hooks for modern React and Next.js applications.

## Installation

```bash
npm install @ted2xmen/hooks
# or
yarn add @ted2xmen/hooks
# or
pnpm add @ted2xmen/hooks
```

## Hooks

### useLocalStorage

A hook for persisting state in localStorage.

```tsx
import { useLocalStorage } from '@ted2xmen/hooks';

function MyComponent() {
  const [value, setValue] = useLocalStorage('my-key', 'initial value');

  return (
    <div>
      <p>Current value: {value}</p>
      <button onClick={() => setValue('new value')}>Update Value</button>
    </div>
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## License

MIT
