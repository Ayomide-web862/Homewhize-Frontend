import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import "./MediaGallery.css";

export default function MediaGallery({ images = [], className = "" }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const touchStartX = useRef(null);
  const viewerRef = useRef(null);
  const previousActiveElement = useRef(null);

  const visibleImages = useMemo(() => images.slice(0, 4), [images]);
  const remainingCount = Math.max(images.length - 4, 0);

  const layoutClassName = useMemo(() => {
    if (!visibleImages.length) return "";
    if (visibleImages.length === 1) return "media-gallery-grid--single";
    if (visibleImages.length === 2) return "media-gallery-grid--two";
    if (visibleImages.length === 3) return "media-gallery-grid--three";
    if (visibleImages.length === 4) return "media-gallery-grid--four";
    return "media-gallery-grid--stack";
  }, [visibleImages.length]);

  const openViewer = useCallback((index) => {
    previousActiveElement.current = document.activeElement;
    setActiveIndex(index);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setActiveIndex(0);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, []);

  const showNextImage = useCallback(() => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const showPreviousImage = useCallback(() => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) {
      showPreviousImage();
    } else if (delta < -50) {
      showNextImage();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!viewerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
        return;
      }

      if (event.key === "Tab") {
        const focusable = viewerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable || focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeViewer, showNextImage, showPreviousImage, viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;

    const timer = window.setTimeout(() => {
      viewerRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [viewerOpen]);

  if (!images.length) return null;

  return (
    <>
      <div className={`media-gallery ${className}`.trim()}>
        <div className={`media-gallery-grid ${layoutClassName}`}>
          {visibleImages.map((image, index) => {
            const isOverflowTile = index === 3 && remainingCount > 0;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                className="media-gallery-item"
                onClick={() => openViewer(index)}
                aria-label={`Open image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Media ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className={`media-gallery-thumb ${loadedImages[index] ? "is-loaded" : ""}`}
                  onLoad={() => handleImageLoad(index)}
                />

                {isOverflowTile && (
                  <span className="media-gallery-overflow">+{remainingCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {viewerOpen && (
        <div
          className="media-gallery-viewer-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={(event) => event.target === event.currentTarget && closeViewer()}
        >
          <div
            className="media-gallery-viewer"
            ref={viewerRef}
            tabIndex={-1}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="media-gallery-close" onClick={closeViewer} aria-label="Close image viewer">
              <FiX />
            </button>

            {images.length > 1 && (
              <>
                <button type="button" className="media-gallery-nav media-gallery-nav--prev" onClick={showPreviousImage} aria-label="Previous image">
                  <FiChevronLeft />
                </button>
                <button type="button" className="media-gallery-nav media-gallery-nav--next" onClick={showNextImage} aria-label="Next image">
                  <FiChevronRight />
                </button>
              </>
            )}

            <div className="media-gallery-stage">
              <img
                src={images[activeIndex]}
                alt={`Expanded media ${activeIndex + 1}`}
                className="media-gallery-viewer-image"
              />
            </div>

            {images.length > 1 && (
              <div className="media-gallery-counter">
                <span>{activeIndex + 1}</span>
                <span>/</span>
                <span>{images.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
