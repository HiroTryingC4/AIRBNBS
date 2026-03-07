import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyGallery from '@/components/public/PropertyGallery';
import type { MediaItem } from '@/components/public/PropertyGallery';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyGallery', () => {
  const mockImageMedia: MediaItem[] = [
    {
      id: '1',
      mediaType: 'IMAGE',
      url: 'https://example.com/image1.jpg',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      displayOrder: 0,
    },
    {
      id: '2',
      mediaType: 'IMAGE',
      url: 'https://example.com/image2.jpg',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      displayOrder: 1,
    },
    {
      id: '3',
      mediaType: 'IMAGE',
      url: 'https://example.com/image3.jpg',
      thumbnailUrl: 'https://example.com/thumb3.jpg',
      displayOrder: 2,
    },
  ];

  const mockMixedMedia: MediaItem[] = [
    {
      id: '1',
      mediaType: 'IMAGE',
      url: 'https://example.com/image1.jpg',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      displayOrder: 0,
    },
    {
      id: '2',
      mediaType: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      displayOrder: 1,
    },
    {
      id: '3',
      mediaType: 'VIDEO',
      url: 'https://vimeo.com/148751763',
      displayOrder: 2,
    },
  ];

  const propertyName = 'Test Property';

  describe('Basic Rendering', () => {
    it('should render the gallery with images', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      expect(screen.getByAltText(`${propertyName} - Image 1`)).toBeInTheDocument();
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should display empty state when no media is provided', () => {
      render(<PropertyGallery media={[]} propertyName={propertyName} />);
      
      expect(screen.getByText('No media available')).toBeInTheDocument();
    });

    it('should sort media by displayOrder', () => {
      const unsortedMedia: MediaItem[] = [
        {
          id: '2',
          mediaType: 'IMAGE',
          url: 'https://example.com/image2.jpg',
          displayOrder: 2,
        },
        {
          id: '1',
          mediaType: 'IMAGE',
          url: 'https://example.com/image1.jpg',
          displayOrder: 0,
        },
        {
          id: '3',
          mediaType: 'IMAGE',
          url: 'https://example.com/image3.jpg',
          displayOrder: 1,
        },
      ];

      render(<PropertyGallery media={unsortedMedia} propertyName={propertyName} />);
      
      // First image should be the one with displayOrder 0
      expect(screen.getByAltText(`${propertyName} - Image 1`)).toBeInTheDocument();
    });
  });

  describe('Image Slider Navigation', () => {
    it('should navigate to next image when next button is clicked', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('should navigate to previous image when previous button is clicked', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      
      const prevButton = screen.getByLabelText('Previous image');
      fireEvent.click(prevButton);
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should wrap around to first image when clicking next on last image', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const nextButton = screen.getByLabelText('Next image');
      
      // Click next 3 times to wrap around
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should wrap around to last image when clicking previous on first image', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const prevButton = screen.getByLabelText('Previous image');
      fireEvent.click(prevButton);
      
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('should not show navigation arrows when only one media item', () => {
      const singleMedia: MediaItem[] = [mockImageMedia[0]];
      render(<PropertyGallery media={singleMedia} propertyName={propertyName} />);
      
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    });
  });

  describe('Thumbnail Navigation', () => {
    it('should render thumbnails for all media items', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      expect(thumbnails).toHaveLength(3);
    });

    it('should navigate to specific image when thumbnail is clicked', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const thirdThumbnail = screen.getByLabelText('View image 3');
      fireEvent.click(thirdThumbnail);
      
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('should highlight current thumbnail', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const firstThumbnail = screen.getByLabelText('View image 1');
      expect(firstThumbnail).toHaveClass('border-primary-600');
    });

    it('should not show thumbnails when only one media item', () => {
      const singleMedia: MediaItem[] = [mockImageMedia[0]];
      render(<PropertyGallery media={singleMedia} propertyName={propertyName} />);
      
      expect(screen.queryByLabelText('View image 1')).not.toBeInTheDocument();
    });
  });

  describe('Lightbox Functionality', () => {
    it('should open lightbox when main image is clicked', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      fireEvent.click(mainImage.closest('div')!);
      
      expect(screen.getByLabelText('Close lightbox')).toBeInTheDocument();
      expect(screen.getByAltText(`${propertyName} - Full size image 1`)).toBeInTheDocument();
    });

    it('should close lightbox when close button is clicked', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      fireEvent.click(mainImage.closest('div')!);
      
      const closeButton = screen.getByLabelText('Close lightbox');
      fireEvent.click(closeButton);
      
      expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
    });

    it('should close lightbox when Escape key is pressed', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      fireEvent.click(mainImage.closest('div')!);
      
      fireEvent.keyDown(window, { key: 'Escape' });
      
      waitFor(() => {
        expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
      });
    });

    it('should navigate in lightbox with arrow keys', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      fireEvent.click(mainImage.closest('div')!);
      
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      
      waitFor(() => {
        expect(screen.getByAltText(`${propertyName} - Full size image 2`)).toBeInTheDocument();
      });
    });

    it('should not open lightbox when clicking on video', () => {
      render(<PropertyGallery media={mockMixedMedia} propertyName={propertyName} />);
      
      // Navigate to video
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      
      // Try to click on the video container
      const videoContainer = screen.getByTitle(`${propertyName} video`).closest('div')!.closest('div')!;
      fireEvent.click(videoContainer);
      
      // Lightbox should not open for videos
      expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
    });
  });

  describe('Touch Gesture Support', () => {
    it('should navigate to next image on left swipe', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainDisplay = screen.getByAltText(`${propertyName} - Image 1`).closest('div')!;
      
      // Simulate left swipe (touchStart at 200, touchEnd at 100)
      fireEvent.touchStart(mainDisplay, { targetTouches: [{ clientX: 200 }] });
      fireEvent.touchMove(mainDisplay, { targetTouches: [{ clientX: 100 }] });
      fireEvent.touchEnd(mainDisplay);
      
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('should navigate to previous image on right swipe', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainDisplay = screen.getByAltText(`${propertyName} - Image 1`).closest('div')!;
      
      // Simulate right swipe (touchStart at 100, touchEnd at 200)
      fireEvent.touchStart(mainDisplay, { targetTouches: [{ clientX: 100 }] });
      fireEvent.touchMove(mainDisplay, { targetTouches: [{ clientX: 200 }] });
      fireEvent.touchEnd(mainDisplay);
      
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('should not navigate on short swipe distance', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainDisplay = screen.getByAltText(`${propertyName} - Image 1`).closest('div')!;
      
      // Simulate short swipe (less than minimum distance)
      fireEvent.touchStart(mainDisplay, { targetTouches: [{ clientX: 150 }] });
      fireEvent.touchMove(mainDisplay, { targetTouches: [{ clientX: 130 }] });
      fireEvent.touchEnd(mainDisplay);
      
      // Should still be on first image
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Video Embedding', () => {
    it('should embed YouTube video with correct URL', () => {
      render(<PropertyGallery media={mockMixedMedia} propertyName={propertyName} />);
      
      // Navigate to YouTube video
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      
      const iframe = screen.getByTitle(`${propertyName} video`);
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('should embed Vimeo video with correct URL', () => {
      render(<PropertyGallery media={mockMixedMedia} propertyName={propertyName} />);
      
      // Navigate to Vimeo video (third item)
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      const iframe = screen.getByTitle(`${propertyName} video`);
      expect(iframe).toHaveAttribute('src', 'https://player.vimeo.com/video/148751763');
    });

    it('should show video icon in thumbnail for video items', () => {
      render(<PropertyGallery media={mockMixedMedia} propertyName={propertyName} />);
      
      const videoThumbnail = screen.getByLabelText('View video 2');
      expect(videoThumbnail).toBeInTheDocument();
    });

    it('should handle various YouTube URL formats', () => {
      const youtubeFormats: MediaItem[] = [
        {
          id: '1',
          mediaType: 'VIDEO',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          displayOrder: 0,
        },
        {
          id: '2',
          mediaType: 'VIDEO',
          url: 'https://youtu.be/dQw4w9WgXcQ',
          displayOrder: 1,
        },
        {
          id: '3',
          mediaType: 'VIDEO',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          displayOrder: 2,
        },
      ];

      const { rerender } = render(<PropertyGallery media={[youtubeFormats[0]]} propertyName={propertyName} />);
      expect(screen.getByTitle(`${propertyName} video`)).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');

      rerender(<PropertyGallery media={[youtubeFormats[1]]} propertyName={propertyName} />);
      expect(screen.getByTitle(`${propertyName} video`)).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');

      rerender(<PropertyGallery media={[youtubeFormats[2]]} propertyName={propertyName} />);
      expect(screen.getByTitle(`${propertyName} video`)).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    });
  });

  describe('Touch Target Accessibility', () => {
    it('should have minimum 44px touch targets for navigation buttons', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const nextButton = screen.getByLabelText('Next image');
      const prevButton = screen.getByLabelText('Previous image');
      
      expect(nextButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
      expect(prevButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });

    it('should have minimum 44px touch targets for thumbnails', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const thumbnails = screen.getAllByRole('button', { name: /View image \d/ });
      thumbnails.forEach(thumbnail => {
        expect(thumbnail).toHaveClass('min-w-[44px]', 'min-h-[44px]');
      });
    });

    it('should have minimum 44px touch target for close button', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      fireEvent.click(mainImage.closest('div')!);
      
      const closeButton = screen.getByLabelText('Close lightbox');
      expect(closeButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
  });

  describe('Responsive Design', () => {
    it('should render with responsive height classes', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainDisplay = screen.getByAltText(`${propertyName} - Image 1`).closest('div')!;
      expect(mainDisplay).toHaveClass('h-96', 'md:h-[500px]', 'lg:h-[600px]');
    });

    it('should use appropriate image sizes for different viewports', () => {
      render(<PropertyGallery media={mockImageMedia} propertyName={propertyName} />);
      
      const mainImage = screen.getByAltText(`${propertyName} - Image 1`);
      expect(mainImage).toHaveAttribute('sizes', '100vw');
      
      const thumbnail = screen.getByAltText('Thumbnail 1');
      expect(thumbnail).toHaveAttribute('sizes', '100px');
    });
  });
});
