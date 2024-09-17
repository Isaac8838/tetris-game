import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import StoreItem from "./StoreItem";
import "@/styles/storePreview.css";

let tetrisSkins = [
    { name: "default", isBuy: true },
    { name: "envelope", isBuy: true },
    { name: "round", isBuy: false },
];

//變成1*2陣列
tetrisSkins = tetrisSkins.reduce((acc, cur, index) => {
    if (index % 2 === 0) acc.push([cur]);
    else acc[acc.length - 1].push(cur);
    return acc;
}, []);

const TetrominoStoreComponent = () => {
    return (
        <div className="relative min-w-[625px] max-w-[39rem] rounded-3xl bg-[#000346] p-8">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl font-bold tracking-wide text-custom-white_text">
                COIN:$200
            </div>
            <Carousel slidesToScroll={3}>
                <CarouselContent>
                    {tetrisSkins.map((skins, i) => (
                        //skins是長度為2的一維陣列
                        <CarouselItem
                            key={`skinstore-${i}`}
                            className="flex basis-1/3 flex-col gap-8"
                        >
                            {skins.map((skin) => (
                                <StoreItem skin={skin} key={`${skin.name}`} />
                            ))}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default TetrominoStoreComponent;
