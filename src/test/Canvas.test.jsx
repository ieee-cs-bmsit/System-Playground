import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Canvas from '../components/builder/Canvas'
import { ReactFlowProvider } from 'reactflow'

// Mock ResizeObserver for React Flow
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

describe('Canvas Component', () => {
    it('renders the React Flow canvas', () => {
        render(
            <ReactFlowProvider>
                <div style={{ height: '500px' }}>
                    <Canvas />
                </div>
            </ReactFlowProvider>
        )
        // React Flow usually renders some controls or attribution, we can check for them
        // or just check if the main container is present.
        const canvasContainer = screen.getByTestId('flow-canvas')
        expect(canvasContainer).toBeInTheDocument()
    })

    it('has the comic style grid background', () => {
        const { container } = render(
            <ReactFlowProvider>
                <div style={{ height: '500px' }}>
                    <Canvas />
                </div>
            </ReactFlowProvider>
        )
        // Check for specific styling classes
        const canvas = screen.getByTestId('flow-canvas')
        expect(canvas).toHaveClass('border-black')
        expect(canvas).toHaveClass('border-4')
    })
})
