"use client";

import { BrandLogo } from "@/components/shared/brand-logo";
import { ActionButton } from "@/components/shared/action-button";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-white">
      <div></div>
      <div className="text-center">
        <BrandLogo />
        <p className="text-gray-600 mb-8">
          Transform your balcony into a thriving garden with AI-powered plant recommendations
        </p>
        <ActionButton onClick={onGetStarted}>
          Get Started
        </ActionButton>
      </div>
      <p className="text-sm text-gray-400">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
} 