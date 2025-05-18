import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PhotoUploadScreen } from '@/components/screens/photo-upload-screen'

describe('PhotoUploadScreen', () => {
  const mockOnBack = jest.fn()
  const mockOnContinue = jest.fn()
  const mockOnAddPhoto = jest.fn().mockResolvedValue(undefined)
  const mockOnEditPhoto = jest.fn().mockResolvedValue(undefined)
  const mockOnDeletePhoto = jest.fn()

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
    onAddPhoto: mockOnAddPhoto,
    onEditPhoto: mockOnEditPhoto,
    onDeletePhoto: mockOnDeletePhoto,
    currentStep: 2,
    totalSteps: 5,
    photos: []
  }

  beforeEach(() => {
    mockOnBack.mockClear()
    mockOnContinue.mockClear()
    mockOnAddPhoto.mockClear()
    mockOnEditPhoto.mockClear()
    mockOnDeletePhoto.mockClear()
  })

  it('renders photo upload screen with all elements', () => {
    render(<PhotoUploadScreen {...defaultProps} />)
    
    expect(screen.getByText(/Let's see your balcony/i)).toBeInTheDocument()
    expect(screen.getByText(/Create a planting plan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument()
  })

  it('handles back button click', () => {
    render(<PhotoUploadScreen {...defaultProps} />)
    
    const backButton = screen.getByRole('button', { name: /Back/i })
    fireEvent.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('handles photo upload', async () => {
    render(<PhotoUploadScreen {...defaultProps} />)
    
    const file = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByTestId('photo-upload')
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    
    expect(mockOnAddPhoto).toHaveBeenCalledWith(file)
  })

  it('handles photo deletion', () => {
    const propsWithPhoto = {
      ...defaultProps,
      photos: [{ id: '1', url: 'test.jpg' }]
    }
    
    render(<PhotoUploadScreen {...propsWithPhoto} />)
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)
    
    expect(mockOnDeletePhoto).toHaveBeenCalledWith('1')
  })
}) 