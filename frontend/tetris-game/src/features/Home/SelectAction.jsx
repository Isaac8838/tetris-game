import { useCarousel } from "@/components/ui/carousel";
import HomeLink from "./HomeLink";

const SelectAction = () => {
    const { scrollPrev } = useCarousel();

    return (
        <ul className="flex h-full flex-col justify-between pt-6">
            <div className="flex flex-col gap-4">
                <HomeLink to="/room">Join Room</HomeLink>
                <HomeLink to="/createRoom">Create Room</HomeLink>
            </div>
            <HomeLink onClick={() => scrollPrev()}>Back</HomeLink>
        </ul>
    );
};

export default SelectAction;
