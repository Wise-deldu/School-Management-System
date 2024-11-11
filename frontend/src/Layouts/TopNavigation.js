import React from 'react'
import './Layouts.css'

const TopNavigation = ({ altText = 'User Avatar' }) => {
  return (
    <div className='topnavContainer'>
      <h2 className='schoolName'>Akatsi college practise school</h2>
      <div>
        <p className='profileName'>System Administrator</p>
      </div>
    </div>
  )
}

export default TopNavigation