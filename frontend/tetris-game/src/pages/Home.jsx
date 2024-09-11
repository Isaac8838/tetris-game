import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import SelectMode from "@/features/Home/SelectMode";
import SelectPage from "@/features/Home/SelectPage";

const Home = () => {
    return (
        <div
            className="min-h-[600px] min-w-[850px] bg-no-repeat bg-center bg-contain relative"
            style={{
                backgroundImage: `url(/img/Tetris-logo.png)`,
            }}
        >
            <Carousel className="absolute left-1/2 top-1/2 -translate-y-2 -translate-x-[50%] w-[15rem]">
                <CarouselContent>
                    <CarouselItem>
                        <SelectPage />
                    </CarouselItem>
                    <CarouselItem>
                        <SelectMode />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default Home;
