# Design Guidelines for Lipi - AI Medical Scribe Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Lunacal.ai's modern, clean aesthetic while adapting Sunoh.ai's medical functionality. This combines the trust and professionalism required for healthcare with contemporary design patterns.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand: 220 85% 60% (Modern blue for trust and medical professionalism)
- Dark mode primary: 220 70% 65%

**Supporting Colors:**
- Success: 142 71% 45% (For completed transcriptions)
- Warning: 38 92% 50% (For review needed states)
- Neutral backgrounds: 220 13% 97% (light), 220 13% 8% (dark)
- Text: 220 9% 15% (light mode), 220 9% 85% (dark mode)

**Accent Treatment:**
- Subtle gradients from primary blue to lighter variants for hero sections
- Minimal use of accent colors to maintain medical professionalism

### B. Typography
**Font Stack:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for transcription text)

**Hierarchy:**
- Hero headings: 3xl-4xl, font-bold
- Section headings: xl-2xl, font-semibold  
- Body text: base-lg, font-normal
- Captions: sm, font-medium

### C. Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: p-2, m-2
- Component spacing: p-4, gap-4, space-y-6
- Section spacing: py-8, py-12, py-16
- Page margins: px-4, px-6, px-8

### D. Component Library

**Navigation:**
- Clean header with logo, navigation links, and CTA button
- Sticky navigation with backdrop blur
- Mobile hamburger menu with slide-out panel

**Hero Section:**
- Large animated soundwave visualization (similar to Sunoh.ai)
- Bold headline with subtitle
- Primary and secondary CTA buttons
- Minimal background gradient overlay

**Process Steps:**
- 5-step visual process flow with numbered icons
- Card-based layout with illustrations
- Progressive reveal on scroll

**Dashboard Components:**
- Clean card-based layout for transcription sessions
- Tabbed interface for different note sections
- Audio player with waveform visualization
- Text editor with syntax highlighting for medical notes

**Data Display:**
- Patient conversation transcripts in chat-like bubbles
- Clinical note sections in structured format
- Progress indicators for transcription status
- Export buttons with download states

**Forms:**
- Floating label inputs
- File upload areas with drag-and-drop
- Toggle switches for settings
- Medical specialty selection dropdowns

### E. Animations
Use sparingly and purposefully:
- Subtle fade-ins on scroll for content sections
- Soundwave animation in hero (key brand element)
- Loading states for AI processing
- Smooth page transitions between dashboard views

## Images
- **Hero Image**: Large animated soundwave graphic (primary brand element)
- **Process Illustrations**: Simple line-art style icons for each step (microphone, dialogue, document, etc.)
- **Customer Photos**: Professional headshots for testimonials
- **Product Screenshots**: Clean dashboard and mobile app interfaces
- **Medical Icons**: Stethoscope, medical charts, and healthcare symbols

The design should convey trust, efficiency, and modern healthcare technology while maintaining the clean, professional aesthetic that medical professionals expect.