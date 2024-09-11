import "@/styles/spinner.css";
const Spinner = ({ width }) => {
    const style = { width: `${width}px` };
    return <p className="spinner aspect-square ml-2" style={style}></p>;
};
export default Spinner;
