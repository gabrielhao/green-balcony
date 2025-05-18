import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WelcomeScreen } from '@/components/screens/welcome-screen'
import { useAppContext } from '@/context/app-context'

// Mock the context
jest.mock('@/context/app-context', () => ({
  useAppContext: jest.fn(),
  STEPS: {
    WELCOME: 0,
    LOCATION: 1,
    PHOTO_UPLOAD: 2,
    PREFERENCES: 3,
    LOADING: 4,
    RESULTS: 5
  }
}))

describe('WelcomeScreen', () => {
  const mockGoToStep = jest.fn()
  const mockOnGetStarted = jest.fn()

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      goToStep: mockGoToStep
    })
    mockOnGetStarted.mockClear()
  })

  it('renders welcome message and start button', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />)
    
    expect(screen.getByText(/Transform your balcony/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument()
  })

  it('calls onGetStarted when start button is clicked', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />)
    
    const startButton = screen.getByRole('button', { name: /Get Started/i })
    fireEvent.click(startButton)
    
    expect(mockOnGetStarted).toHaveBeenCalled()
  })
}) 