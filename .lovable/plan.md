
# GroundState — Implementation Plan

## Design System
- **Dark mode**: slate-950 background, slate-300 text, teal-500/emerald-600 accents
- **Typography**: Inter font, monospace feel, generous whitespace
- **Animations**: Subtle fade-ins, slow transitions using CSS animations
- **RTL support**: `dir="auto"` on text inputs for Hebrew

## Crisis Safety System
- Constant array of Hebrew + English crisis keywords
- On any input submission, scan for keywords
- If detected: overlay a **non-dismissible safety screen** with emergency hotline numbers (clickable `tel:` links)
- All other UI hidden, app state frozen

## User Journey (4 States)

### State 0 — Entry
- Centered minimal input with placeholder text
- "Initiate Dump" submit button
- Triggers safety check → proceeds to State 1

### State 1 — Deconstruction
- User's text fades to 30% opacity and shrinks
- Acknowledgment message appears
- "Begin" button fades in after 3-second delay

### State 2 — 5-4-3-2-1 Grounding Protocol
- Sequential steps (5 see → 4 feel → 3 hear → 2 smell → 1 taste)
- Checkbox clicks per step, must complete before advancing
- Progress indicator for current step

### State 3 — Resolution
- Breathing circle animation: 4s expand, 7s hold, 8s contract (looping)
- Closing stabilization message
- "Restart Protocol" button resets to State 0

## Technical Approach
- Single-page app, no routing needed — state machine in one component
- All logic is client-side (no backend required)
- CSS keyframes for breathing circle animation
- `useState` for state management, `useEffect` for timers
