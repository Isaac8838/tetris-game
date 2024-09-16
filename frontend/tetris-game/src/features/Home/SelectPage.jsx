import { useCarousel } from "@/components/ui/carousel";
import HomeLink from "./HomeLink";

const SelectPage = () => {
    const { scrollNext } = useCarousel();
    return (
        <ul className="pt-6 gap-4 flex flex-col">
            <HomeLink onClick={() => scrollNext()}>Start</HomeLink>
            <HomeLink to="/rank">Rank</HomeLink>
            <HomeLink to="/listScore">List Score</HomeLink>
            <HomeLink to="/achievement">Achieve</HomeLink>
        </ul>
    );
};

export default SelectPage;
