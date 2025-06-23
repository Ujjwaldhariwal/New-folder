import React from 'react'
import {CircularProgress} from '@mui/material';

const Loader = (props) => {
  return (
    <div className="full-window-loader" style={{ display: props.propData ? 'flex' : 'none' }}>
        <CircularProgress size={80} thickness={4} style={{ color: '#1976D2' }} />
    </div>
  )
}

export default Loader