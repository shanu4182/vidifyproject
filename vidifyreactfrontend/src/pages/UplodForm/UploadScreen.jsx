import React, { useState } from 'react';
import './uplod.css';
import VideoUpload from './Videouplod';
import MovieUpload from './MovieUpload';
import SeriesUpload from './SeriesUpload';
import ShortsUpload from './ShortsUpload';

function UploadScreen() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className='UploadScreen'>
            <div className='tab'>
                <button 
                    onClick={() => setActiveTab(1)} 
                    className={activeTab === 1 ? 'active' : undefined}
                >
                    Add Video
                </button>
                <button 
                    onClick={() => setActiveTab(2)} 
                    className={activeTab === 2 ? 'active' : undefined}
                >
                    Add Movies
                </button>
                <button 
                    onClick={() => setActiveTab(3)} 
                    className={activeTab === 3 ? 'active' : undefined}
                >
                    Add Playlist or Series
                </button>
                <button 
                    onClick={() => setActiveTab(4)} 
                    className={activeTab === 4 ? 'active' : undefined}
                >
                    Add Shorts
                </button>
            </div>
            {
                activeTab === 1 ? <VideoUpload /> 
                : activeTab === 2 ? <MovieUpload /> 
                : activeTab === 3 ? <SeriesUpload /> 
                : <ShortsUpload />
            }
        </div>
    );
}

export default UploadScreen;
