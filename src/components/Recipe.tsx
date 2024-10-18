import React from 'react';
import Image from 'next/image';
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
  image,
  nutrition,
  recipeType,
  keywords,
  suitableForDiet,
  recipeEquipment,
  datePublished
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
        <p><strong>Type:</strong> {recipeType}</p>
        <p><strong>Suitable for Diet:</strong> {suitableForDiet}</p>
        <p><strong>Date Published:</strong> {datePublished}</p>
      </div>
      {image && (
        <div className="mb-4">
          <Image 
            src={image.sourceUrl} 
            alt={image.altText || name} 
            width={600} 
            height={400} 
            className="rounded-lg"
          />
        </div>
      )}
      <h4 className="text-xl font-semibold mb-2">Ingredients:</h4>
      <ul className="list-disc list-inside mb-4">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="mb-1">{ingredient}</li>
        ))}
      </ul>
      <h4 className="text-xl font-semibold mb-2">Instructions:</h4>
      <ol className="list-decimal list-inside mb-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="mb-2">{instruction}</li>
        ))}
      </ol>
      <h4 className="text-xl font-semibold mb-2">Equipment:</h4>
      <ul className="list-disc list-inside mb-4">
        {recipeEquipment.map((equipment, index) => (
          <li key={index} className="mb-1">{equipment}</li>
        ))}
      </ul>
      <h4 className="text-xl font-semibold mb-2">Nutrition Information:</h4>
      <ul className="list-none mb-4">
        {Object.entries(nutrition).map(([key, value]) => (
          <li key={key} className="mb-1"><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
      <p className="text-sm text-gray-600">Keywords: {keywords}</p>
    </div>
  );
};

export default Recipe;
