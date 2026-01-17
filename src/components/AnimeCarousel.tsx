"use client";

import * as React from "react";
import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContentCarousel<T>({
  data,
  render,
}: {
  data?: T[];
  render: (item: T) => React.ReactNode;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
  }, []);

  React.useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  const items = data ?? [];

  return (
    <div className="w-full overflow-visible">
      <CarouselRoot
        setApi={setApi}
        className="w-full max-w-full overflow-visible"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-4 md:-ml-6 overflow-visible">
          {items.map((item, i) => (
            <CarouselItem key={i} className="pl-4 md:pl-6 basis-auto">
              {render(item)}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={cn(
            "left-4 bg-primary border-primary/50 hover:bg-primary/90 text-primary-foreground",
            "shadow-lg hover:shadow-xl hover:scale-110 transition-all",
          )}
        />
        <CarouselNext
          className={cn(
            "right-4 bg-primary border-primary/50 hover:bg-primary/90 text-primary-foreground",
            "shadow-lg hover:shadow-xl hover:scale-110 transition-all",
          )}
        />
      </CarouselRoot>

      <CarouselIndicators count={count} current={current} onSelect={scrollTo} />
    </div>
  );
}

function CarouselIndicators({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  if (count <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: count }).map((_, i) => (
        <Button
          key={i}
          variant="ghost"
          size="sm"
          onClick={() => onSelect(i)}
          className={cn(
            "w-3 h-3 rounded-full p-0 transition-all duration-300",
            "hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary",
            current === i + 1 && "scale-125",
          )}
          style={{
            backgroundColor: current === i + 1 ? "#3b82f6" : "#1a1f3a",
            borderColor: current === i + 1 ? "#3b82f6" : "#60a5fa",
            boxShadow:
              current === i + 1 ? "0 0 15px rgba(59, 130, 246, 0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}
