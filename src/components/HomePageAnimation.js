import React, { useState } from 'react';
import './HomePageAnimation.css';

function HomePageAnimation() {
    const [isVisible, setIsVisible] = useState(true);
  
    const handleClick = () => {
      setIsVisible(false);
    };
  
    return (
      <div 
        className={isVisible ? "coverScreen" : "coverScreen hideAnimation"} 
        onClick={handleClick}
      >
        {isVisible && (
          <div className="loaderWrapper">
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="companyName">synchrony</span> 
          </div>
        )}
      </div>
    );
  }

export default HomePageAnimation;

