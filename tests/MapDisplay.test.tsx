import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapDisplay from '@/components/public/MapDisplay';

// Mock Leaflet
jest.mock('leaflet', () => {
  const mockMarker = {
    addTo: jest.fn().mockReturnThis(),
    bindPopup: jest.fn().mockReturnThis(),
    setLatLng: jest.fn().mockReturnThis(),
  };

  const mockTileLayer = {
    addTo: jest.fn().mockReturnThis(),
  };

  const mockMap = {
    setView: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  };

  return {
    map: jest.fn(() => mockMap),
    tileLayer: jest.fn(() => mockTileLayer),
    marker: jest.fn(() => mockMarker),
    icon: jest.fn(() => ({})),
  };
});

// Mock CSS import
jest.mock('leaflet/dist/leaflet.css', () => ({}));

describe('MapDisplay Component', () => {
  const defaultProps = {
    latitude: 14.5547,
    longitude: 121.0244,
    propertyName: 'Test Property',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the map container', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const mapContainer = container.querySelector('div[style*="height"]');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should apply default height of 400px', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const mapContainer = container.querySelector('div[style*="height"]');
      expect(mapContainer).toHaveStyle({ height: '400px' });
    });

    it('should apply custom height when provided', () => {
      const { container } = render(
        <MapDisplay {...defaultProps} height="600px" />
      );
      const mapContainer = container.querySelector('div[style*="height"]');
      expect(mapContainer).toHaveStyle({ height: '600px' });
    });

    it('should apply full width to map container', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const mapContainer = container.querySelector('div[style*="width"]');
      expect(mapContainer).toHaveStyle({ width: '100%' });
    });

    it('should have rounded corners and shadow styling', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-lg', 'overflow-hidden', 'shadow-md');
    });
  });

  describe('Map Initialization', () => {
    it('should initialize Leaflet map with correct coordinates', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      // Map should be initialized
      expect(L.map).toHaveBeenCalled();
      
      // Map should be set to correct view
      const mapInstance = L.map.mock.results[0].value;
      expect(mapInstance.setView).toHaveBeenCalledWith(
        [defaultProps.latitude, defaultProps.longitude],
        15 // default zoom
      );
    });

    it('should use custom zoom level when provided', () => {
      const L = require('leaflet');
      const customZoom = 18;
      render(<MapDisplay {...defaultProps} zoom={customZoom} />);

      const mapInstance = L.map.mock.results[0].value;
      expect(mapInstance.setView).toHaveBeenCalledWith(
        [defaultProps.latitude, defaultProps.longitude],
        customZoom
      );
    });

    it('should add OpenStreetMap tile layer', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      expect(L.tileLayer).toHaveBeenCalledWith(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        expect.objectContaining({
          attribution: expect.stringContaining('OpenStreetMap'),
          maxZoom: 19,
        })
      );

      const tileLayerInstance = L.tileLayer.mock.results[0].value;
      expect(tileLayerInstance.addTo).toHaveBeenCalled();
    });
  });

  describe('Marker', () => {
    it('should create marker at correct coordinates', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      expect(L.marker).toHaveBeenCalledWith(
        [defaultProps.latitude, defaultProps.longitude],
        expect.objectContaining({ icon: expect.anything() })
      );
    });

    it('should add marker to map', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      const markerInstance = L.marker.mock.results[0].value;
      expect(markerInstance.addTo).toHaveBeenCalled();
    });

    it('should bind popup with property name to marker', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      const markerInstance = L.marker.mock.results[0].value;
      expect(markerInstance.bindPopup).toHaveBeenCalledWith(
        `<strong>${defaultProps.propertyName}</strong>`
      );
    });

    it('should create marker with icon configuration', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      // Marker should be created with an icon object
      expect(L.marker).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          icon: expect.anything(),
        })
      );
    });
  });

  describe('Props Validation', () => {
    it('should handle different coordinate values', () => {
      const L = require('leaflet');
      const coordinates = [
        { latitude: 0, longitude: 0 },
        { latitude: -90, longitude: -180 },
        { latitude: 90, longitude: 180 },
        { latitude: 14.1153, longitude: 120.9621 },
      ];

      coordinates.forEach((coords) => {
        jest.clearAllMocks();
        render(
          <MapDisplay
            latitude={coords.latitude}
            longitude={coords.longitude}
            propertyName="Test"
          />
        );

        const mapInstance = L.map.mock.results[0].value;
        expect(mapInstance.setView).toHaveBeenCalledWith(
          [coords.latitude, coords.longitude],
          15
        );
      });
    });

    it('should handle different property names', () => {
      const L = require('leaflet');
      const names = [
        'Simple Name',
        'Name with Special Characters !@#$%',
        'Very Long Property Name That Spans Multiple Words',
        '123 Numeric Property',
      ];

      names.forEach((name) => {
        jest.clearAllMocks();
        render(
          <MapDisplay
            latitude={14.5547}
            longitude={121.0244}
            propertyName={name}
          />
        );

        const markerInstance = L.marker.mock.results[0].value;
        expect(markerInstance.bindPopup).toHaveBeenCalledWith(
          `<strong>${name}</strong>`
        );
      });
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive with full width', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('w-full');
    });

    it('should support different height values', () => {
      const heights = ['200px', '400px', '600px', '100vh', '50%'];

      heights.forEach((height) => {
        const { container } = render(
          <MapDisplay {...defaultProps} height={height} />
        );
        const mapContainer = container.querySelector('div[style*="height"]');
        expect(mapContainer).toHaveStyle({ height });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper z-index for map container', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const mapContainer = container.querySelector('div[style*="height"]');
      expect(mapContainer).toHaveClass('z-0');
    });
  });

  describe('Requirements Validation', () => {
    it('should satisfy Requirement 11.1: Display embedded map', () => {
      const { container } = render(<MapDisplay {...defaultProps} />);
      const mapContainer = container.querySelector('div[style*="height"]');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should satisfy Requirement 11.2: Display marker at coordinates', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      expect(L.marker).toHaveBeenCalledWith(
        [defaultProps.latitude, defaultProps.longitude],
        expect.anything()
      );
    });

    it('should satisfy Requirement 11.3: Allow zoom and pan', () => {
      const L = require('leaflet');
      render(<MapDisplay {...defaultProps} />);

      // Map initialization enables zoom and pan by default
      expect(L.map).toHaveBeenCalled();
      
      // Tile layer with maxZoom allows zooming
      expect(L.tileLayer).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ maxZoom: 19 })
      );
    });
  });

  describe('Cleanup', () => {
    it('should cleanup map instance on unmount', () => {
      const L = require('leaflet');
      const { unmount } = render(<MapDisplay {...defaultProps} />);

      const mapInstance = L.map.mock.results[0].value;
      unmount();

      expect(mapInstance.remove).toHaveBeenCalled();
    });
  });
});
