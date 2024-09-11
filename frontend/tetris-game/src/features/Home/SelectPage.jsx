import { useCarousel } from "@/components/ui/carousel";
import HomeLink from "./HomeLink";

const SelectPage = () => {
    const { scrollNext } = useCarousel();
    return (
        <ul className="pt-4 gap-2 flex flex-col">
            <HomeLink onClick={() => scrollNext()}>Start</HomeLink>
            <HomeLink to="/rank">Rank</HomeLink>
            <HomeLink to="/listScore">List Score</HomeLink>
            <HomeLink to="/achievement">Achieve</HomeLink>
        </ul>
    );
};

export default SelectPage;
