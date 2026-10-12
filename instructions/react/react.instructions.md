---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# React Rules Index

This file has been **split into focused rule sets** for better Cursor performance and maintainability.

## Rule Files Overview

### 🎯 [react-core.mdc](./react-core.instructions.md)

**Core React patterns, components, and essential practices**

- Functional components and hooks
- State management patterns
- Component composition
- Event handling
- Form handling with React Hook Form

### 🏗️ [react-architecture.md](./react-archiecture.instructions.md)

**Project structure, file organization, and architectural patterns**

- Directory structure standards
- File naming conventions
- Feature-based architecture
- Import organization
- Routing patterns

### 🔧 [react-typescript.md](./react-typescript.instructions.md)

**TypeScript best practices and code quality standards**

- Strict TypeScript configuration
- Component props typing
- API and service typing
- Error handling patterns
- Documentation standards

### ⚡ [react-performance.md](./react-performance.instructions.md)

**Performance optimization and bundle management**

- Component optimization (memoization)
- Code splitting strategies
- Image optimization
- Bundle size management
- Performance monitoring

### 🧪 [react-testing-security.md](./react-testing-security.instructions.md)

**Testing strategies, security practices, and accessibility**

- Component and hook testing
- API mocking with MSW
- Security best practices
- Accessibility guidelines
- E2E testing with Cypress

## Quick Reference

### Essential Patterns

```typescript
// Functional component with TypeScript
interface Props {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<Props> = ({ title, onAction }) => {
  const [state, setState] = useState<StateType>(initialState);

  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return <div onClick={handleClick}>{title}</div>;
};
```

### State Management

- **Local State**: `useState`, `useReducer`
- **Shared State**: Context API, Zustand
- **Server State**: React Query/TanStack Query
- **Global State**: Redux Toolkit

### Performance Rules

- Use `React.memo` for expensive components
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive calculations
- Implement code splitting for routes
- Virtual scrolling for large lists

### Testing Requirements

- 70% unit tests, 20% integration, 10% E2E
- Use React Testing Library with semantic queries
- Mock APIs with MSW
- Include accessibility tests
- Test error boundaries

---

## Migration Notes

The original comprehensive rules file has been split for better organization:

- **Improved focus**: Each file covers specific concerns
- **Better performance**: Shorter files for Cursor to process
- **Easier maintenance**: Targeted updates to specific areas
- **Clearer structure**: Find relevant rules faster

**All previous functionality is preserved** across the split files.
