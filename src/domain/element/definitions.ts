import type { ElementType, ElementDefinition } from './types';

export const SYSTEM_ELEMENT_DEFINITIONS: Record<ElementType, ElementDefinition> = {
  text: {
    type: 'text',
    defaultWidth: 300,
    defaultHeight: 50,
    resizable: true,
  },
  photo: {
    type: 'photo',
    defaultWidth: 200,
    defaultHeight: 200,
    resizable: true,
  },
  spotify: {
    type: 'spotify',
    defaultWidth: 300,
    defaultHeight: 80,
    resizable: false, // Spotify iframes generally have fixed layout constraints
  },
  map: {
    type: 'map',
    defaultWidth: 300,
    defaultHeight: 250,
    resizable: true,
  },
  rsvp: {
    type: 'rsvp',
    defaultWidth: 320,
    defaultHeight: 400,
    resizable: true,
  },
  upi_qr: {
    type: 'upi_qr',
    defaultWidth: 200,
    defaultHeight: 250,
    resizable: true,
  },
  shape: {
    type: 'shape',
    defaultWidth: 100,
    defaultHeight: 100,
    resizable: true,
  },
  custom: {
    type: 'custom',
    defaultWidth: 200,
    defaultHeight: 200,
    resizable: true,
  }
};
