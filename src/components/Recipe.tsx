// src/components/Recipe.tsx
import React from 'react';
import { Recipe as RecipeType } from '../types';

interface RecipeProps {
  recipeData: RecipeType;
}

const Recipe: React.FC<RecipeProps> = ({ recipeData }) => {
  if (!recipeData) {
    return null;
  }

  return (
    <section className="recipe-section my-8">
      <h2 className="text-2xl font-bold mb-4">{recipeData.name}</h2>
      <p className="mb-4">{recipeData.description}</p>
      <div className="mb-4">
        <p><strong>Prep Time:</strong> {recipeData.prepTime}</p>
        <p><strong>Cook Time:</strong> {recipeData.cookTime}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
      <ul className="list-disc list-inside mb-4">
        {recipeData.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-2">Instructions</h3>
      <ol className="list-decimal list-inside">
        {recipeData.instructions.map((instruction, index) => (
          <li key={index} className="mb-2">{instruction}</li>
        ))}
      </ol>
    </section>
  );
};

export default Recipe;
