interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <span className="text-6xl">🍽️</span>
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
      <img
        src={images[0]}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
