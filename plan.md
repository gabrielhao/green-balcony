Let me break down the essential UI components and architecture needed to transform the current design into a functional Next.js webapp.

### Core UI Components

1. **Layout Components**
```typescript
// Basic layout structure
- DeviceFrame ✅
  - props: children, screenLabel?
- ProgressBar ✅
  - props: currentStep, totalSteps
- BackButton ✅
  - props: onClick
```

2. **Screen-specific Components**
```typescript
// Welcome Screen
- WelcomeScreen ✅
  - BrandLogo ✅
  - ActionButton ✅

// Location Screens
- ParallaxContainer ✅
  - props: backgroundImage, foregroundImage
- LocationPermissionCard ✅
  - props: onAllow, onManualSet

// Photo Upload
- PhotoGrid ✅
  - PhotoCard ✅
    - props: image, onEdit, onDelete
  - AddPhotoButton ✅
    - props: onAdd

// Plant Preferences
- PreferenceCard ✅
  - props: icon, title, description, selected, onSelect
- SubOptionsList ✅
  - props: options, parentSelected

// Results
- SlidingPanel ✅
  - props: children, initialHeight, maxHeight
- PlantCard ✅
  - props: plant{name, location, description, image}
- ActionButtonGroup ✅
  - props: primaryAction, secondaryAction
```

3. **Shared Components**
```typescript
// Common elements
- IconButton ✅
  - props: icon, onClick, variant
- GradientText ✅
  - props: children, gradient
- LoadingAnimation ✅
  - props: tips[]
```

### Basic Architecture

```typescript
// Core Structure
src/
  ├── components/ ✅
  │   ├── layout/ ✅
  │   ├── screens/ ✅
  │   └── shared/ ✅
  ├── hooks/
  │   ├── usePhotoUpload
  │   ├── useLocation
  │   └── usePlantPreferences
  ├── types/
  │   └── index.ts
  ├── utils/
  │   ├── animations.ts
  │   └── validation.ts
  └── pages/ ✅
      ├── index.tsx ✅
      ├── location.tsx
      ├── photos.tsx
      ├── preferences.tsx ✅
      └── results.tsx ✅
```

### Core Modules Implementation

1. **State Management**
```typescript
// Using React Context for global state
interface AppState {
  currentStep: number;
  location: LocationData;
  photos: PhotoData[];
  preferences: PlantPreferences;
  results: PlantResult[];
}
```

2. **Navigation Flow**
```typescript
// Route Protection & Flow Control
const routes = {
  welcome: '/', ✅
  location: '/location',
  photos: '/photos',
  preferences: '/preferences', ✅
  results: '/results' ✅
};

// Progress tracking
const steps = {
  LOCATION: 1,
  PHOTOS: 2,
  PREFERENCES: 3, ✅
  RESULTS: 4 ✅
};
```

3. **Core Features**
```typescript
// Location Service
const useLocation = () => {
  // Geolocation API integration
  // Manual location input handling
};

// Photo Management
const usePhotoUpload = () => {
  // Image upload & validation
  // Photo grid management
};

// Plant Preferences
const usePlantPreferences = () => {
  // Selection state management
  // Validation rules
};
```

### Minimal Implementation Strategy

1. **Start with Static Components**
   - Build UI components without state ✅
   - Focus on responsive design ✅
   - Implement basic animations ✅

2. **Add Interactivity**
   - Implement sliding panels ✅
   - Add photo upload functionality
   - Handle location permissions

3. **Connect Components**
   - Implement navigation flow ✅
   - Add state management
   - Connect user inputs ✅

### Key Technical Considerations

1. **Performance**
   - Lazy load images
   - Component code splitting
   - Optimize animations

2. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

3. **Responsive Design**
   - Mobile-first approach ✅
   - Touch interactions ✅
   - Device frame adaptation ✅


