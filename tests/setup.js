import '@testing-library/jest-dom';

// Mock React Flow
jest.mock('reactflow', () => ({
    ReactFlowProvider: ({ children }) => children,
    useNodesState: () => [[], jest.fn(), jest.fn()],
    useEdgesState: () => [[], jest.fn(), jest.fn()],
    Background: () => null,
    Controls: () => null,
    MiniMap: () => null,
    Handle: () => null,
    Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' }
}));

// Mock zustand
jest.mock('zustand');
