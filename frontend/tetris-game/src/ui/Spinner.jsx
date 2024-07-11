import "styles/spinner.css";
const Spinner = ({ width }) => {
    const style = { width: `${width}px` };
    return <div className="spinner" style={style}></div>;
};
export default Spinner;
