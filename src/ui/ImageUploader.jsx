import { CloudArrowUpIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@material-tailwind/react';
import React from 'react';

/**
 * @param {String} name - name attr of input tag: eg image
 * @param {String} preview - image file/blob
 * @param {Boolean} isFileLoading - Loading indicator
 * @param {Function} onFileChange - callback on image change
 */
const ImageUploader = ({ label='Upload Image', name='image', preview='', isFileLoading=false,  onFileChange=null, className=''}) => {
    return (
        <div className={`relative mt-1 flex flex-col justify-center items-center min-h-[105px] rounded border-2 border-dashed p-0.5 overflow-hidden ![background-size:_100%_100%] !bg-no-repeat ${className}`} style={{background: `url('${preview}')`}}>
            <label className='cursor-pointer'>
                <input type="file" disabled={isFileLoading} onChange={(e) => onFileChange && onFileChange(e, name)} accept="image/*" className="hidden" />
                <Tooltip content='Change Image' className='py-1 text-xs'>
                <PencilIcon className='size-8 hover:bg-primary transition-all duration-500 hover:text-white bg-back text-fore border p-1.5 rounded absolute right-1 top-1' />
                </Tooltip>
                <CloudArrowUpIcon className='size-10 text-fore/70' />
            </label>
            <small>{label}</small>
        </div>
    );
};

export default ImageUploader;