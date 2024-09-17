import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { changeSkin } from "../User/userSlice";

const ApplyButton = ({ skinName, isUsed }) => {
    const dispatch = useDispatch();

    const handleApply = () => {
        console.log(skinName);
        dispatch(changeSkin(skinName));
        //調用 API
    };

    return (
        <Button
            onClick={handleApply}
            className="w-full rounded-full bg-custom-orange_bg text-lg"
            disabled={isUsed}
        >
            <p className="text-shadow-sm">Apply</p>
        </Button>
    );
};

export default ApplyButton;
