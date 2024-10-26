import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { changeSkin, updateTokenThunk } from "../User/userSlice";
import { useEffect, useRef } from "react";
import { applySkinAPI } from "@/utils/WebAPI";
import { useToast } from "@/hooks/use-toast";

const ApplyButton = ({ skin_id, isUsed, refetchSkinList }) => {
    const dispatch = useDispatch();

    const { access_token } = useSelector((state) => state.user);

    const access_tokenRef = useRef(access_token);

    const { toast } = useToast();

    useEffect(() => {
        access_tokenRef.current = access_token;
    }, [access_token]);

    const handleApply = async () => {
        await dispatch(updateTokenThunk());

        //調用 API
        const { skin_id: appliedSkin } = await applySkinAPI({
            access_token: access_tokenRef.current,
            skin_id,
        });

        await dispatch(changeSkin(appliedSkin));

        await refetchSkinList();

        toast({ description: "Your skin has been applied" });
    };

    return (
        <Button
            onClick={(e) => {
                e.stopPropagation();
                handleApply();
            }}
            className="w-full rounded-full bg-custom-orange_bg text-lg"
            disabled={isUsed}
        >
            <p className="text-shadow-sm">Apply</p>
        </Button>
    );
};

export default ApplyButton;
