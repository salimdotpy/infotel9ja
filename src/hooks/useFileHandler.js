import { useState } from 'react';

const useFileHandler = ({ images = {},  setValue, clearErrors}) => {
  const [imgFiles, setImgFiles] = useState(images);
  const [isFileLoading, setFileLoading] = useState(false);

  const onFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFileLoading(true);
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgFiles((prev) => ({
                ...prev,
                [fieldName]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    }
    setValue(fieldName, file);
    clearErrors(fieldName);
    setFileLoading(false);
  };
  return { imgFiles, isFileLoading, onFileChange };
};

export default useFileHandler;