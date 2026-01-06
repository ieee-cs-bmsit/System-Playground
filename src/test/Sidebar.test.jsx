import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from '../components/builder/Sidebar'

describe('Sidebar Component Palette', () => {
    it('renders component categories', () => {
        render(<Sidebar />)
        expect(screen.getByText(/Components/i)).toBeInTheDocument()
        expect(screen.getByText(/OS Components/i)).toBeInTheDocument()
    })

    it('renders draggable items', () => {
        render(<Sidebar />)
        const cpuItem = screen.getByText(/CPU Core/i)
        expect(cpuItem).toBeInTheDocument()
        expect(cpuItem).toHaveAttribute('draggable', 'true')
    })
})
