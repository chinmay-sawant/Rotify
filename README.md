# 🎵 Rotify - Spotify Music Dashboard

A beautiful, modern Spotify music dashboard built with React, TypeScript, and Vite. Discover your recently played tracks with stunning animations and a sleek theme system.

## ✨ Features

### 🎨 Advanced Theme System
- **Light & Dark Mode**: Seamlessly switch between beautiful light and dark themes
- **Animated Theme Toggle**: Smooth transitions with celestial animations (stars for dark mode, clouds for light mode)
- **CSS Variables**: Consistent theming throughout the application
- **Automatic Theme Persistence**: Your theme preference is saved locally

### 🔐 Enhanced Authentication
- **Improved Login UI**: Beautiful, modern login interface with Spotify branding
- **Loading States**: Visual feedback during authentication process
- **Secure OAuth 2.0**: Powered by Spotify's robust authentication system
- **Feature Showcase**: Highlights what you can do with the app

### 🎵 Music Dashboard
- **Recently Played Tracks**: View your last 10 played songs
- **Album Art**: High-quality album covers with hover effects
- **Artist Information**: Complete track and artist details
- **Responsive Grid**: Adaptive layout for all screen sizes

### 🎭 Stunning Animations
- **Page Transitions**: Smooth entry animations for all components
- **Hover Effects**: Interactive card animations with scale and glow effects
- **Theme Transitions**: Fluid color transitions when switching themes
- **Staggered Loading**: Cards animate in sequence for visual appeal
- **Floating Background**: Dynamic background particles with ambient motion

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for medium-sized screens
- **Desktop Enhanced**: Rich experience on larger displays
- **Touch Friendly**: All interactive elements are touch-optimized

## 🚀 Tech Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and IntelliSense support
- **Vite**: Lightning-fast development and build tool
- **CSS3**: Advanced animations and modern styling
- **Spotify Web API**: Real-time music data integration

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rotify.git
   cd rotify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify API**
   - Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Add your redirect URI (e.g., `http://localhost:5173`)
   - Create a `.env` file in the root directory:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Theme System

The application features a sophisticated theme system with:

### CSS Custom Properties
All colors and styling are controlled through CSS custom properties, making theme switching instant and smooth.

### Theme Toggle Component
The theme toggle includes:
- Animated sun/moon icons
- Sliding toggle with smooth transitions
- Contextual background elements (stars for dark, clouds for light)
- Accessibility features with proper ARIA labels

### Persistent Theme State
Your theme preference is automatically saved to localStorage and restored on page reload.

## 🎭 Animation Details

### Page Load Animations
- **Staggered Entry**: Elements animate in sequence
- **Scale & Fade**: Smooth scaling combined with opacity transitions
- **Slide Up**: Elements slide up from below the viewport

### Interactive Animations
- **Hover Effects**: Cards lift and glow on hover
- **Image Transformations**: Album art scales and rotates
- **Button Interactions**: Micro-interactions on all clickable elements

### Theme Transition Effects
- **Color Morphing**: Smooth color transitions between themes
- **Background Flow**: Animated background gradient changes
- **Element Recoloring**: All UI elements transition colors smoothly

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header with user info
│   ├── SpotifyAuth.tsx # Enhanced authentication component
│   └── ThemeToggle.tsx # Animated theme switcher
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management hook
├── services/           # API services
│   └── SpotifyService.ts # Spotify API integration
├── styles/             # CSS files
│   └── App.css         # Main application styles with theme system
└── types/              # TypeScript type definitions
```

## 🌟 Key Features Implementation

### Theme System Architecture
- **CSS Variables**: Dynamic theming through custom properties
- **React Hook**: `useTheme` hook for theme state management
- **LocalStorage**: Persistent theme preference storage
- **CSS Transitions**: Smooth animations between theme changes

### Authentication Flow
- **OAuth 2.0 PKCE**: Secure authentication without client secret
- **Token Management**: Automatic token storage and validation
- **Error Handling**: Graceful error states and user feedback
- **Loading States**: Visual feedback during authentication

### Responsive Design Strategy
- **Mobile First**: Base styles optimized for mobile
- **Progressive Enhancement**: Desktop features added via media queries
- **Flexible Grid**: CSS Grid with responsive columns
- **Touch Optimization**: Larger touch targets for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify Web API** for providing music data
- **React Team** for the amazing framework
- **Vite Team** for the blazing fast build tool
- **Design Inspiration** from modern music applications
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
