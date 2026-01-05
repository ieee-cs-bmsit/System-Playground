import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('Home Page', () => {
    it('renders the main title', () => {
        render(<App />)
        const titleElement = screen.getByText(/Interactive Visual System Builder/i)
        expect(titleElement).toBeInTheDocument()
    })

    it('renders the start button', () => {
        render(<App />)
        const button = screen.getByRole('button', { name: /Start Building/i })
        expect(button).toBeInTheDocument()
    })
})
