import { useState } from 'react';

const useFileHandler = ({ setValue, clearErrors }) => {
  const [imgFiles, setImgFiles] = useState(null);
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
          setValue(fieldName, reader.result);
        };
        reader.readAsDataURL(file);
    }
    clearErrors(fieldName);
    setFileLoading(false);
  };
  return { imgFiles, isFileLoading, onFileChange, setImgFiles };
};

export default useFileHandler;