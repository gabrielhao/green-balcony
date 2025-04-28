"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { IconButton } from '@/components/shared';

// Plant 详情数据映射
const plantDetails = {
  "Parsley": {
    name: "Parsley",
    scientificName: "Petroselinum crispum",
    heroImage: "/assets/plants/parsley-hero.jpg",
    icon: "/assets/icons/parsley.svg",
    growingConditions: {
      sunlight: "Partial Shade",
      water: "Moderate Water",
      temperature: "15-25°C"
    },
    planting: [
      "Sow seeds 1-2 cm deep in well-draining soil",
      "Space plants 15-20 cm apart",
      "Keep soil consistently moist until germination"
    ],
    care: [
      "Water regularly but avoid waterlogging",
      "Trim regularly to encourage bushier growth",
      "Remove any yellow or damaged leaves"
    ],
    harvesting: "Harvest outer stems at soil level when leaves are dark green and fresh. Regular harvesting encourages new growth. Best flavor when harvested in the morning."
  },
  "Cilantro/Coriander": {
    name: "Cilantro/Coriander",
    scientificName: "Coriandrum sativum",
    heroImage: "/assets/plants/cilantro-hero.jpg",
    icon: "/assets/icons/cilantro.svg",
    growingConditions: {
      sunlight: "Partial Shade",
      water: "Regular Water",
      temperature: "15-22°C"
    },
    planting: [
      "Sow seeds directly in soil, 0.5-1 cm deep",
      "Space plants 10-15 cm apart",
      "Prefers rich, well-draining soil"
    ],
    care: [
      "Water consistently to prevent bolting",
      "Grows best in cool weather",
      "Succession planting keeps harvest going"
    ],
    harvesting: "Cut outer leaves when plants are 10-15 cm tall. For coriander seeds, let plants flower and harvest when seeds turn brown."
  },
  "Mint": {
    name: "Mint",
    scientificName: "Mentha spp.",
    heroImage: "/assets/plants/mint-hero.jpg",
    icon: "/assets/icons/mint.svg",
    growingConditions: {
      sunlight: "Partial Shade",
      water: "Regular Water",
      temperature: "18-26°C"
    },
    planting: [
      "Plant in containers to control spreading",
      "Space plants 20-30 cm apart",
      "Use rich, moist soil"
    ],
    care: [
      "Keep soil consistently moist",
      "Pinch growing tips to encourage bushiness",
      "Consider planting in pots as mint spreads rapidly"
    ],
    harvesting: "Harvest leaves anytime once plant is established. Best flavor before flowering. Morning harvest provides the most aromatic oils."
  },
  "Basil": {
    name: "Basil",
    scientificName: "Ocimum basilicum",
    heroImage: "/assets/plants/basil-hero.jpg",
    icon: "/assets/icons/basil.svg",
    growingConditions: {
      sunlight: "Full Sun",
      water: "Moderate Water",
      temperature: "20-30°C"
    },
    planting: [
      "Plant in warm soil after frost danger has passed",
      "Space plants 20-25 cm apart",
      "Prefers rich, well-draining soil"
    ],
    care: [
      "Water at base of plant to avoid leaf diseases",
      "Pinch flowers to extend leaf production",
      "Protect from cold temperatures"
    ],
    harvesting: "Pick leaves from the top down, pinching just above a pair of leaves to encourage branching. Harvest before flowering for best flavor."
  },
};

export default function PlantDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantName = searchParams.get('name') || 'Parsley';
  const plant = plantDetails[plantName as keyof typeof plantDetails] || plantDetails.Parsley;
  
  const handleBackClick = () => {
    router.back();
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="relative h-[40%] bg-black transition-all duration-300">
            <img 
              src={plant.heroImage} 
              alt={`${plant.name} plant`} 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute top-6 left-6">
              <IconButton 
                icon="ri-arrow-left-line" 
                onClick={handleBackClick}
                variant="light"
                ariaLabel="Go back"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white -mt-6 rounded-t-3xl overflow-y-auto transition-all duration-300">
            <div className="px-6 py-8">
              {/* Plant Identity */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-[32px] font-bold text-gray-900 mb-2">{plant.name}</h1>
                  <p className="text-gray-500 italic">{plant.scientificName}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center">
                  <img src={plant.icon} alt="" className="w-6 h-6"/>
                </div>
              </div>

              {/* Growing Conditions */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Growing Conditions</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-primary-bg rounded-2xl flex flex-col items-center justify-center">
                    <i className="ri-sun-line text-2xl text-primary mb-2"></i>
                    <p className="text-sm text-center">{plant.growingConditions.sunlight}</p>
                  </div>
                  <div className="aspect-square bg-primary-bg rounded-2xl flex flex-col items-center justify-center">
                    <i className="ri-drop-line text-2xl text-primary mb-2"></i>
                    <p className="text-sm text-center">{plant.growingConditions.water}</p>
                  </div>
                  <div className="aspect-square bg-primary-bg rounded-2xl flex flex-col items-center justify-center">
                    <i className="ri-temp-cold-line text-2xl text-primary mb-2"></i>
                    <p className="text-sm text-center">{plant.growingConditions.temperature}</p>
                  </div>
                </div>
              </div>

              {/* Planting Guide */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Planting Guide</h2>
                <div className="space-y-4">
                  {plant.planting.map((step, index) => (
                    <div key={`planting-${index}`} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-600 text-base pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Tips */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Care Tips</h2>
                <div className="space-y-4">
                  {plant.care.map((tip, index) => (
                    <div key={`care-${index}`} className="flex items-start gap-4">
                      <i className="ri-check-line text-xl text-primary"></i>
                      <p className="text-gray-600 text-base">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Harvesting */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Harvesting</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.harvesting}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 