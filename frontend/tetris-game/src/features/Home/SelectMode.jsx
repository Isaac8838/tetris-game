import { useCarousel } from "@/components/ui/carousel";
import HomeLink from "./HomeLink";

const SelectMode = () => {
    const { scrollPrev } = useCarousel();
    return (
        <ul className="pt-4 flex flex-col justify-between h-full">
            <div>
                <HomeLink to="/game">Single</HomeLink>
                <HomeLink to="/room">Multiple</HomeLink>
            </div>
            <HomeLink onClick={() => scrollPrev()}>Back</HomeLink>
        </ul>
    );
};

export default SelectMode;
