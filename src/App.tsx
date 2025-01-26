import React, { useState, useRef } from "react";
import "./App.css";

const reelsData = [
  "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Kiku Sir.mp4",
  "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Naazuk.mp4",
  "./test_video_4.mp4",
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0); // Stores the initial touch point
  const currentY = useRef(0); // Stores the current touch point during the move
  const accumulatedDeltaY = useRef(0); // Accumulates scroll distance
  const isDragging = useRef(false); // Flags if the user is dragging
  const isScrolling = useRef(false); // Prevents multiple updates during a scroll or touch gesture

  const SCROLL_THRESHOLD = 50; // Threshold for swipe detection (for touch)
  const WHEEL_THRESHOLD = 300; // Threshold for scroll detection (for wheel)

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    currentY.current = e.touches[0].clientY;

    // Add visual feedback during dragging
    if (containerRef.current) {
      const diff = currentY.current - startY.current;
      containerRef.current.style.transform = `translateY(${diff / 3}px)`;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    const diff = currentY.current - startY.current;

    if (containerRef.current) {
      containerRef.current.style.transition = "transform 0.3s ease";
      containerRef.current.style.transform = "translateY(0px)";
    }

    if (diff > SCROLL_THRESHOLD && currentIndex > 0) {
      // Swipe down
      setCurrentIndex((prev) => prev - 1);
    } else if (diff < -SCROLL_THRESHOLD && currentIndex < reelsData.length - 1) {
      // Swipe up
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;

    accumulatedDeltaY.current += e.deltaY;

    if (accumulatedDeltaY.current > WHEEL_THRESHOLD && currentIndex < reelsData.length - 1) {
      // Scroll down
      setCurrentIndex((prev) => prev + 1);
      accumulatedDeltaY.current = 0;
      isScrolling.current = true;
    } else if (accumulatedDeltaY.current < -WHEEL_THRESHOLD && currentIndex > 0) {
      // Scroll up
      setCurrentIndex((prev) => prev - 1);
      accumulatedDeltaY.current = 0;
      isScrolling.current = true;
    }

    // Reset scrolling state
    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
  };

  return (
    <div
      className="vertical-swipeable-reels-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        className="reel-wrapper"
        ref={containerRef}
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
          transition: "transform 0.5s ease", // Smooth transition
        }}
      >
        {reelsData.map((reel, index) => (
          <div key={index} className="reel">
            <video
              src={reel}
              controls
              autoPlay
              loop
              muted
              className="reel-video"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;




// import React, { useState, useRef } from "react";
// import "./App.css";

// const reelsData = [
//   "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Kiku Sir.mp4",
//   "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Naazuk.mp4",
//   "./test_video_4.mp4",
// ];

// const App: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const startY = useRef(0);
//   const currentY = useRef(0);
//   const isDragging = useRef(false);
//   const isScrolling = useRef(false);
//   const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

//   const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
//     const clientY = (e as React.TouchEvent).touches
//       ? (e as React.TouchEvent).touches[0].clientY
//       : (e as React.MouseEvent).clientY;

//     startY.current = clientY;
//     currentY.current = clientY;
//     isDragging.current = true;
//   };

//   const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
//     if (!isDragging.current) return;

//     const clientY = (e as React.TouchEvent).touches
//       ? (e as React.TouchEvent).touches[0].clientY
//       : (e as React.MouseEvent).clientY;

//     currentY.current = clientY;

//     // Add a limited translate effect for visual feedback
//     if (containerRef.current) {
//       const diff = currentY.current - startY.current;
//       containerRef.current.style.transform = `translateY(${diff / 3}px)`; // Limit drag translation for smoother feedback
//     }
//   };

//   const handleTouchEnd = () => {
//     isDragging.current = false;

//     const diff = currentY.current - startY.current;

//     if (containerRef.current) {
//       containerRef.current.style.transition = "transform 0.3s ease";
//       containerRef.current.style.transform = "translateY(0px)";
//     }

//     if (diff > 50 && currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1); // Swipe down
//     } else if (diff < -50 && currentIndex < reelsData.length - 1) {
//       setCurrentIndex(currentIndex + 1); // Swipe up
//     }
//   };

//   const handleWheel = (e: React.WheelEvent) => {
//     if (isScrolling.current) return;

//     const direction = e.deltaY > 0 ? 1 : -1; // 1 for scroll down, -1 for scroll up

//     // Update the currentIndex only if within bounds
//     const newIndex = currentIndex + direction;

//     if (newIndex >= 0 && newIndex < reelsData.length) {
//       setCurrentIndex(newIndex);
//       isScrolling.current = true;

//       // Debounce scrolling
//       if (scrollTimeout.current) {
//         clearTimeout(scrollTimeout.current);
//       }
//       scrollTimeout.current = setTimeout(() => {
//         isScrolling.current = false;
//       }, 300);
//     }
//   };

//   return (
//     <div
//       className="vertical-swipeable-reels-container"
//       onMouseDown={handleTouchStart}
//       onMouseMove={handleTouchMove}
//       onMouseUp={handleTouchEnd}
//       onMouseLeave={handleTouchEnd}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onWheel={handleWheel} // Add scroll event handler
//     >
//       <div
//         className="reel-wrapper"
//         ref={containerRef}
//         style={{
//           transform: `translateY(-${currentIndex * 100}%)`,
//         }}
//       >
//         {reelsData.map((reel, index) => (
//           <div key={index} className="reel">
//             <video
//               src={reel}
//               controls
//               autoPlay
//               loop
//               muted
//               className="reel-video"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;


// import React, { useState, useRef } from "react";
// import "./App.css";

// const reelsData = [
//   "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Kiku Sir.mp4",
//   "https://pologames-reel-bucket.s3.ap-south-1.amazonaws.com/reels/Naazuk.mp4",
//   "./test_video_4.mp4",
// ];

// const App: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const accumulatedDeltaY = useRef(0); // Accumulates scroll distance
//   const isScrolling = useRef(false); // Prevents multiple updates during a scroll gesture

//   const SCROLL_THRESHOLD = 300; // Minimum scroll distance to trigger a reel change

//   const handleWheel = (e: React.WheelEvent) => {
//     if (isScrolling.current) return;

//     accumulatedDeltaY.current += e.deltaY;

//     if (accumulatedDeltaY.current > SCROLL_THRESHOLD && currentIndex < reelsData.length - 1) {
//       // Scroll down
//       setCurrentIndex(currentIndex + 1);
//       accumulatedDeltaY.current = 0; // Reset accumulated delta
//       isScrolling.current = true;
//     } else if (accumulatedDeltaY.current < -SCROLL_THRESHOLD && currentIndex > 0) {
//       // Scroll up
//       setCurrentIndex(currentIndex - 1);
//       accumulatedDeltaY.current = 0; // Reset accumulated delta
//       isScrolling.current = true;
//     }

//     // Reset the scrolling flag after a short delay
//     setTimeout(() => {
//       isScrolling.current = false;
//     }, 300);
//   };

//   return (
//     <div
//       className="vertical-swipeable-reels-container"
//       onWheel={handleWheel} // Add scroll event handler
//     >
//       <div
//         className="reel-wrapper"
//         ref={containerRef}
//         style={{
//           transform: `translateY(-${currentIndex * 100}%)`,
//           transition: "transform 0.5s ease", // Smooth transition
//         }}
//       >
//         {reelsData.map((reel, index) => (
//           <div key={index} className="reel">
//             <video
//               src={reel}
//               controls
//               autoPlay
//               loop
//               muted
//               className="reel-video"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;
