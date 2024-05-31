import "./index.css";

import Preview from "pages/Game/Preview";

const Previews = ({ tetrominoes }) => {
    // 拿到要preview的3個tetromino
    const previewTetrominoes = tetrominoes.slice(-3).reverse();
    // console.log(tetrominoes);
    return (
        <div className="previews">
            {previewTetrominoes.map((tetromino, index) => (
                <Preview
                    key={index}
                    tetromino={tetromino}
                    index={index}
                ></Preview>
            ))}
        </div>
    );
};

export default Previews;
