import React from 'react';
import JsonLd from './JsonLd';
import { Recipe } from '../types';

interface RecipeSchemaProps {
  recipeData: Recipe;
}

const RecipeSchema: React.FC<RecipeSchemaProps> = ({ recipeData }) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipeData.name,
    description: recipeData.description,
    prepTime: recipeData.prepTime,
    cookTime: recipeData.cookTime,
    recipeIngredient: recipeData.ingredients,
    recipeInstructions: recipeData.instructions.map(instruction => ({
      '@type': 'HowToStep',
      text: instruction
    })),
  };

  return <JsonLd data={schemaData} />;
};

export default RecipeSchema;
