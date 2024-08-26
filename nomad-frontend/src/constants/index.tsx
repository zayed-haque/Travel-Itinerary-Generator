import React from 'react';
import { MapPin, Camera, Users, Utensils, Calendar, DollarSign } from 'lucide-react';
import { TravelOption, Category } from '../types';

export const travelOptions: TravelOption[] = [
  { icon: <MapPin className="w-6 h-6" />, title: 'Destinations' },
  { icon: <Camera className="w-6 h-6" />, title: 'Adventures' },
  { icon: <Users className="w-6 h-6" />, title: 'Group Travel' },
  { icon: <Utensils className="w-6 h-6" />, title: 'Culinary Tours' },
];

export const categories: Category[] = [
  { name: 'Dates', icon: Calendar },
  { name: 'Location', icon: MapPin },
  { name: 'Budget', icon: DollarSign },
  { name: 'Travelers', icon: Users },
  { name: 'Activities', icon: Camera },
  { name: 'Meal Preferences', icon: Utensils },
];

export const activityOptions = [
  'Sightseeing', 'Museums', 'Hiking', 'Beach', 'Shopping', 'Nightlife', 'Local Cuisine'
];