import { useEffect, useRef } from 'react'
import './MagicBento.css'

const MagicBento = ({ children }) => {
  const containerRef = useRef(null)
  const shapesRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create shapes
    const shapes = []
    const shapeCount = 15

    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div')
      shape.className = 'bento-shape'
      
      // Random properties
      const size = Math.random() * 60 + 20 // 20-80px
      const x = Math.random() * 100 // 0-100%
      const y = Math.random() * 100 // 0-100%
      const rotation = Math.random() * 360 // 0-360deg
      const animationDelay = Math.random() * 5 // 0-5s
      const animationDuration = Math.random() * 10 + 10 // 10-20s
      
      // Random shape type
      const shapeTypes = ['circle', 'square', 'triangle', 'diamond']
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      
      shape.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        transform: rotate(${rotation}deg);
        animation-delay: ${animationDelay}s;
        animation-duration: ${animationDuration}s;
        --shape-type: ${shapeType};
      `
      
      container.appendChild(shape)
      shapes.push(shape)
    }

    shapesRef.current = shapes

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      shapes.forEach((shape, index) => {
        const speed = 0.3 + (index % 4) * 0.2 // Different speeds for variety
        const moveX = (x - 0.5) * 30 * speed
        const moveY = (y - 0.5) * 30 * speed
        
        // Get the original rotation from the shape's style
        const originalRotation = shape.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg']
        const rotation = originalRotation[1]
        
        // Add subtle scale effect based on distance from center
        const distanceFromCenter = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
        const scale = 1 + distanceFromCenter * 0.1
        
        shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}) scale(${scale})`
        shape.style.opacity = 0.6 + distanceFromCenter * 0.4
      })
    }

    // Reset shapes when mouse leaves
    const handleMouseLeave = () => {
      shapes.forEach((shape) => {
        const originalRotation = shape.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg']
        const rotation = originalRotation[1]
        shape.style.transform = `translate(0px, 0px) rotate(${rotation}) scale(1)`
        shape.style.opacity = '0.8'
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      shapes.forEach(shape => shape.remove())
    }
  }, [])

  return (
    <div className="magic-bento-container" ref={containerRef}>
      <div className="bento-content">
        {children}
      </div>
    </div>
  )
}

export default MagicBento
