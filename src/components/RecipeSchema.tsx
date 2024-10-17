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
  image
}) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name,
    description,
    prepTime,
    cookTime,
    totalTime,
    recipeYield,
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map(instruction => ({
      '@type': 'HowToStep',
      text: instruction
    })),
    recipeCategory,
    recipeCuisine,
    author: {
      '@type': 'Person',
      name: author
    },
    image
  };

  return <JsonLd data={schemaData} />;
};

export default RecipeSchema;
