import SkinPreviews from "@/features/Store/SkinPreviews";
import TetrominoStoreComponent from "@/features/Store/TetrominoStoreComponent";

const TetrominoStore = () => {
    return (
        <div className="flex justify-center gap-32 px-32">
            <SkinPreviews />
            <TetrominoStoreComponent />
        </div>
    );
};

export default TetrominoStore;
