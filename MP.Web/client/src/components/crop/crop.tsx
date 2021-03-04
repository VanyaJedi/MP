import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import './crop.scss';

interface Props {
  img: string;
  setFinalImg: (url: string) => void;
}

const CropPopup: React.FunctionComponent<Props> = ({ img, setFinalImg }: Props) => {
  
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 40, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>();

  const onLoad = useCallback((img: any) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    const image = imgRef.current;
    if (!completedCrop || !image) {
      return;
    }
    
    const canvas = document.createElement('canvas');
    const crop = completedCrop;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;  
    
    if (ctx && crop.width !== undefined && crop.height !== undefined && crop.x !== undefined && crop.y !== undefined) {
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

   const imgUrl = canvas.toDataURL();
   setFinalImg(imgUrl)

  }, [completedCrop]);
 
  return (
      <ReactCrop 
        className="crop__area" 
        onImageLoaded={onLoad}
        src={img} 
        crop={crop} 
        onChange={newCrop => setCrop(newCrop)}
        onComplete={(c) => setCompletedCrop(c)}
      />    
  );

};

export default CropPopup;