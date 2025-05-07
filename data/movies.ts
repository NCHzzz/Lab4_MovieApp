import { Movie } from '../types';

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'Three rodents amuse themselves by harassing creatures of the forest. However, the squirrel they tease is not as helpless as he appears.',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '9:56',
    genre: ['Animation', 'Short']
  },
  {
    id: '2',
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '10:53',
    genre: ['Animation', 'Fantasy']
  },
  {
    id: '3',
    title: 'Sintel',
    description: 'A lonely girl called Sintel searches for a baby dragon she calls Scales.',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '14:48',
    genre: ['Animation', 'Adventure']
  },
  {
    id: '4',
    title: 'Tears of Steel',
    description: 'In a post-apocalyptic world, a group of survivors try to save humanity from robot domination.',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '12:14',
    genre: ['Sci-Fi', 'Action']
  },
  {
    id: '5',
    title: 'Subaru Outback',
    description: 'Driving in the country',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: '0:20',
    genre: ['Commercial']
  },
  {
    id: '6',
    title: 'What care means',
    description: 'Smoking awareness video',
    // Fixed thumbnail URL - using a reliable placeholder image
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCareMeans.mp4',
    duration: '0:42',
    genre: ['Public Service']
  },
  {
    id: '7',
    title: 'For Bigger Blazes',
    description: 'HBO GO now works with Chromecast',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:15',
    genre: ['Commercial', 'Tech']
  },
  {
    id: '8',
    title: 'For Bigger Escapes',
    description: 'Introducing Chromecast, the easiest way to enjoy online video on your TV',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '0:15',
    genre: ['Commercial', 'Tech']
  },
  {
    id: '9',
    title: 'For Bigger Fun',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '0:60',
    genre: ['Commercial', 'Tech']
  },
  {
    id: '10',
    title: 'For Bigger Joyrides',
    description: 'Introducing Chromecast. Control your TV with your phone, tablet, or laptop',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '0:15',
    genre: ['Commercial', 'Tech']
  },
  {
    id: '11',
    title: 'For Bigger Meltdowns',
    description: 'Google Chromecast: For Bigger Meltdowns',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '0:15',
    genre: ['Commercial', 'Tech']
  },
  {
    id: '12',
    title: 'The Mysterious Life',
    description: 'A dive into the ocean and the wonders hidden beneath the surface',
    thumbnail: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Reusing existing video
    duration: '5:22',
    genre: ['Nature', 'Documentary']
  }
];