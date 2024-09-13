import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import SelectAction from "@/features/Home/SelectAction";
import SelectMode from "@/features/Home/SelectMode";
import SelectPage from "@/features/Home/SelectPage";

const Home = () => {
    return (
        <div
            className="relative min-h-[600px] min-w-[850px] bg-contain bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(/img/Tetris-logo.png)`,
            }}
        >
            <Carousel className="absolute left-1/2 top-1/2 w-[15rem] -translate-x-[50%] -translate-y-2">
                <CarouselContent>
                    <CarouselItem>
                        <SelectPage />
                    </CarouselItem>
                    <CarouselItem>
                        <SelectMode />
                    </CarouselItem>
                    <CarouselItem>
                        <SelectAction />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default Home;
