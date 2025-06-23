import React from 'react'
import {CircularProgress} from '@mui/material';

const ContentLoader = (props) => {
  return (
    <div className="content-loader" style={{ display: props.propData ? 'flex' : 'none' }}>
        <CircularProgress  size={80} thickness={4} style={{ color: '#1976D2' }} />
               
    </div>
  )
}
export default ContentLoader;
