import Editor from 'react-simple-wysiwyg';

import React, { useState } from 'react';

const Wysiwsg = ({ className = '', defaultValue='', onChange=null }) => {
    const [html, setHtml] = useState(defaultValue);

    const handleChange = (e) => {
        setHtml(e.target.value);
        onChange && onChange(e.target.value);
    }

    return (
        <Editor value={html} onChange={handleChange} className={className} />
    );
};

export default Wysiwsg;