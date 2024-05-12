import React from "react";

import Preview from "pages/Home/Game/Preview"

const Previews = ({ tetrominoes }) => {
    const previewTetrominoes = tetrominoes
        .slice(1 - tetrominoes.length)
        .reverse();
    
    return(
        <>
            {previewTetrominoes.map((tetrominoe,index) => (
                <Preview tetrominoe = {tetrominoe} index = {index} key={index}/>
            ))}
        </>
    )
}

export default React.memo(Previews);