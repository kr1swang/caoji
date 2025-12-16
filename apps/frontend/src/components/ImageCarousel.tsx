'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  title: string
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  if (images.length === 0) return null

  return (
    <Carousel
      className="w-full rounded-lg overflow-hidden shadow-sm"
      opts={{ active: images.length > 1, loop: true }}
      plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
    >
      <CarouselContent>
        {images.map((imagePath, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-21/9 w-full overflow-hidden rounded-lg">
              <Image
                src={imagePath}
                alt={`${title} - 圖片 ${index + 1}`}
                fill={true}
                className="scale-110 object-cover blur-lg"
                sizes="100vw"
                priority={index === 0}
              />
              <Image
                src={imagePath}
                alt={`${title} - 圖片 ${index + 1}`}
                fill={true}
                className="object-contain"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </>
      )}
    </Carousel>
  )
}
