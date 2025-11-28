/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useMemo } from "react";
import { backgrounds } from "~/data/backgrounds";
import { random } from "~/utils/misc";
import { usePreferences } from "./app-context";

const backgroundStyles = `
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  filter: 
    saturate(1.4) 
    blur(8px) 
    brightness(0.7)
    contrast(1.1);
  transition: filter 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.background-video::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(131, 56, 236, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(10, 10, 15, 0.9) 0%, rgba(15, 15, 26, 0.7) 50%, rgba(10, 10, 15, 0.9) 100%);
  pointer-events: none;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(135deg, 
      rgba(10, 10, 15, 0.85) 0%, 
      rgba(15, 15, 26, 0.75) 50%, 
      rgba(10, 10, 15, 0.85) 100%),
    radial-gradient(circle at 15% 70%, rgba(58, 134, 255, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(131, 56, 236, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 
    100px 100px,
    150px 150px,
    200px 200px;
  opacity: 0.3;
  animation: particle-drift 60s infinite linear;
  pointer-events: none;
}

@keyframes particle-drift {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.background-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  opacity: 0.1;
  pointer-events: none;
  animation: scanline 2s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.background-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(131, 56, 236, 0.15) 0%, transparent 50%);
  filter: blur(40px);
  opacity: 0.3;
  pointer-events: none;
  animation: glow-pulse 8s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .background-video {
    filter: 
      saturate(1.3) 
      blur(4px) 
      brightness(0.75)
      contrast(1.05);
    opacity: 0.35;
  }
  
  .background-overlay {
    background: 
      linear-gradient(135deg, 
        rgba(10, 10, 15, 0.9) 0%, 
        rgba(15, 15, 26, 0.8) 50%, 
        rgba(10, 10, 15, 0.9) 100%);
  }
}

@media (max-width: 768px) {
  .background-video {
    filter: 
      saturate(1.2) 
      blur(2px) 
      brightness(0.8)
      contrast(1.02);
    opacity: 0.3;
  }
  
  .background-particles {
    opacity: 0.2;
  }
  
  .background-glow {
    opacity: 0.2;
  }
}
`;

export function Background() {
  const { background: current } = usePreferences();

  const background = useMemo(() => {
    return current ?? random(backgrounds).value;
  }, [current]);

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="background-container">
        <video
          autoPlay
          className="background-video"
          disablePictureInPicture={true}
          loop
          muted
          onContextMenu={(event) => event.preventDefault()}
          src={`/videos/bg-${background}.webm`}
          suppressHydrationWarning
        />
        <div className="background-overlay" />
        <div className="background-particles" />
        <div className="background-scanlines" />
        <div className="background-glow" />
      </div>
    </>
  );
}