import React from 'react';
import JsonLd from './JsonLd';
import { Recipe as RecipeType } from '../types';

const RecipeSchema: React.FC<RecipeType> = ({
  name,
  description,
  prepTime,
  cookTime,
  totalTime,
  recipeYield,
  ingredients,
  instructions,
  recipeCategory,
  recipeCuisine,
  author,
  image,
  nutrition,
  recipeType,
  keywords,
  suitableForDiet,
  recipeEquipment,
  datePublished
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
    ...(description && { description }),
    ...(prepTime && { prepTime }),
    ...(cookTime && { cookTime }),
    ...(totalTime && { totalTime }),
    ...(recipeYield && { recipeYield }),
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map(instruction => ({
      '@type': 'HowToStep',
      text: instruction
    })),
    ...(recipeCategory && { recipeCategory }),
    ...(recipeCuisine && { recipeCuisine }),
    ...(author && {
      author: {
        '@type': 'Person',
        name: author
      }
    }),
    ...(image && { 
      image: typeof image === 'string' ? image : image.sourceUrl 
    }),
    ...(nutrition && {
      nutrition: {
        '@type': 'NutritionInformation',
        ...nutrition
      }
    }),
    ...(recipeType && { recipeType }),
    ...(keywords && { keywords }),
    ...(suitableForDiet && { suitableForDiet }),
    ...(recipeEquipment && { recipeEquipment }),
    ...(datePublished && { datePublished })
  };

  return <JsonLd data={schemaData} />;
};

export default RecipeSchema;
