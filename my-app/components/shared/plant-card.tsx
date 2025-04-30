"use client";

interface PlantCardProps {
  plant: {
    name: string;
//    location: string;
    description: string;
//    image: string;
  };
  onMoreInfoClick: (plantName: string) => void;
}

export function PlantCard({ plant, onMoreInfoClick }: PlantCardProps) {
  //const { name, location, description, image } = plant;
  const { name, description } = plant;
  
  return (
    <div className="plant-card flex items-start gap-4 mb-8">
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
        {/* <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        /> */}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900">{name}</h3>
        {/* <p className="text-gray-500 italic mt-1">{location}</p> */}
        <p className="text-gray-600 mt-2 mb-4 text-base">
          {description}
        </p>
        <button 
          onClick={() => onMoreInfoClick(name)}
          className="more-info-btn text-[#3B5E43] font-medium bg-[#F5F7F5] rounded-full px-6 py-2.5 text-base transition-all duration-300"
        >
          More about {name}
        </button>
      </div>
    </div>
  );
} 