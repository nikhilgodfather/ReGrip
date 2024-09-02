import React from 'react';
import { API_URL } from '../Config/index';

const ImageDisplay = ({ imageUrl,imageId }) => {
    return (
        <img src={`${API_URL}/upload/readimageurl?imagename=${imageUrl}&folder=${imageId}`} alt={imageUrl} width="80" height="60" />
    );
};

export default ImageDisplay;