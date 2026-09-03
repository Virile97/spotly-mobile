import type { ImageSource } from 'expo-image';

export interface OnboardingSlideData {
  id: string;
  image: ImageSource;
  badgeText?: string;
  title: string;
  description: string;
}

export const onboardingSlides: OnboardingSlideData[] = [
  {
    id: 'discover',
    image: require('../../../../assets/images/onboarding/slide-discover.png'),
    badgeText: 'Open · 1.2 km away',
    title: 'Discover places through real experiences.',
    description: 'See where people are going and discover places worth visiting.',
  },
  {
    id: 'share',
    image: require('../../../../assets/images/onboarding/slide-share.png'),
    title: 'Share your experience.',
    description: 'Post photos and moments from the places you visit for others to see.',
  },
  {
    id: 'destination',
    image: require('../../../../assets/images/onboarding/slide-destination.png'),
    title: 'Find your next destination.',
    description: 'Get personalized recommendations based on what people like you love.',
  },
];
