import React from 'react'

const PopcornLogo = ({ size = 60, className = "" }) => {
  return (
    <img 
      src="/popcorn_logo.png"
      alt="PopcornAI Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        mixBlendMode: 'multiply',
        filter: 'contrast(1.1) brightness(1.05)'
      }}
    />
  )
}

export default PopcornLogo
