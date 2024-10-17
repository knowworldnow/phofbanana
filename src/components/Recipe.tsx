import React from 'react';
import { Recipe as RecipeType } from '../types';

const Recipe: React.FC<RecipeType> = ({
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
  return (
    <div className="recipe bg-white shadow-md rounded-lg p-6 my-8">
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="mb-4 text-gray-600">{description}</p>
      <div className="recipe-meta mb-4 grid grid-cols-2 gap-2">
        <p><strong>Prep Time:</strong> {prepTime}</p>
        <p><strong>Cook Time:</strong> {cookTime}</p>
        <p><strong>Total Time:</strong> {totalTime}</p>
        <p><strong>Yield:</strong> {recipeYield}</p>
        <p><strong>Category:</strong> {recipeCategory}</p>
        <p><strong>Cuisine:</strong> {recipeCuisine}</p>
        <p><strong>Author:</strong> {author}</p>
      </div>
      {image && <img src={image} alt={name} className="w-full h-auto mb-4 rounded-lg" />}
      <h4 className="text-xl font-semibold mb-2">Ingredients:</h4>
      <ul className="list-disc list-inside mb-4">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="mb-1">{ingredient}</li>
        ))}
      </ul>
      <h4 className="text-xl font-semibold mb-2">Instructions:</h4>
      <ol className="list-decimal list-inside">
        {instructions.map((instruction, index) => (
          <li key={index} className="mb-2">{instruction}</li>
        ))}
      </ol>
    </div>
  );
};

export default Recipe;
