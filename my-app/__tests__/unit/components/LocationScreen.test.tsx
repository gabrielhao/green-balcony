import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LocationScreen } from '@/components/screens/location-screen'

describe('LocationScreen', () => {
  const mockOnBack = jest.fn()
  const mockOnAllow = jest.fn()
  const mockOnManualSet = jest.fn()

  const defaultProps = {
    onBack: mockOnBack,
    onAllow: mockOnAllow,
    onManualSet: mockOnManualSet,
    currentStep: 1,
    totalSteps: 5,
    backgroundImage: '/images/background.jpg',
    foregroundImage: '/images/foreground.png'
  }

  beforeEach(() => {
    mockOnBack.mockClear()
    mockOnAllow.mockClear()
    mockOnManualSet.mockClear()
  })

  it('renders location screen with all elements', () => {
    render(<LocationScreen {...defaultProps} />)
    
    expect(screen.getByText(/Plants need care/i)).toBeInTheDocument()
    expect(screen.getByText(/We need your location to provide accurate sunlight & temp data/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Allow Location Access/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Set Location Manually/i })).toBeInTheDocument()
  })

  it('handles back button click', () => {
    render(<LocationScreen {...defaultProps} />)
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    fireEvent.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('handles allow location click', () => {
    render(<LocationScreen {...defaultProps} />)
    
    const allowButton = screen.getByRole('button', { name: /Allow Location Access/i })
    fireEvent.click(allowButton)
    
    expect(mockOnAllow).toHaveBeenCalled()
  })

  it('handles manual set click', () => {
    render(<LocationScreen {...defaultProps} />)
    
    const manualSetButton = screen.getByRole('button', { name: /Set Location Manually/i })
    fireEvent.click(manualSetButton)
    
    expect(mockOnManualSet).toHaveBeenCalled()
  })
}) 