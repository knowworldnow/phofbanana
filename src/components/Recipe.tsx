import React from 'react';
import Image from 'next/image';
import { Recipe as RecipeType } from '../types';

const Recipe: React.FC<{ recipeData: RecipeType }> = ({ recipeData }) => {
  if (!recipeData) {
    return null;
  }

  const {
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
  } = recipeData;

  return (
    <div className="recipe bg-white shadow-md rounded-lg p-6 my-8">
      <h2 className="text-3xl font-bold mb-4">{name}</h2>
      {description && <p className="mb-4 text-gray-600">{description}</p>}
      <div className="recipe-meta mb-4 grid grid-cols-2 gap-2">
        {prepTime && <p><strong>Prep Time:</strong> {prepTime}</p>}
        {cookTime && <p><strong>Cook Time:</strong> {cookTime}</p>}
        {totalTime && <p><strong>Total Time:</strong> {totalTime}</p>}
        {recipeYield && <p><strong>Yield:</strong> {recipeYield}</p>}
        {recipeCategory && <p><strong>Category:</strong> {recipeCategory}</p>}
        {recipeCuisine && <p><strong>Cuisine:</strong> {recipeCuisine}</p>}
        {author && <p><strong>Author:</strong> {author}</p>}
        {recipeType && <p><strong>Type:</strong> {recipeType}</p>}
        {suitableForDiet && <p><strong>Suitable for Diet:</strong> {suitableForDiet}</p>}
        {datePublished && <p><strong>Date Published:</strong> {datePublished}</p>}
      </div>
      {image && typeof image === 'string' && (
        <div className="mb-4">
          <Image 
            src={image} 
            alt={name || 'Recipe image'} 
            width={600} 
            height={400} 
            className="rounded-lg"
          />
        </div>
      )}
      {image && typeof image === 'object' && 'sourceUrl' in image && (
        <div className="mb-4">
          <Image 
            src={image.sourceUrl} 
            alt={image.altText || name || 'Recipe image'} 
            width={600} 
            height={400} 
            className="rounded-lg"
          />
        </div>
      )}
      {ingredients && ingredients.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside mb-4">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="mb-1">{ingredient}</li>
            ))}
          </ul>
        </>
      )}
      {instructions && instructions.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside mb-4">
            {instructions.map((instruction, index) => (
              <li key={index} className="mb-2">{instruction}</li>
            ))}
          </ol>
        </>
      )}
      {recipeEquipment && recipeEquipment.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-2">Equipment:</h3>
          <ul className="list-disc list-inside mb-4">
            {recipeEquipment.map((equipment, index) => (
              <li key={index} className="mb-1">{equipment}</li>
            ))}
          </ul>
        </>
      )}
      {nutrition && (
        <>
          <h3 className="text-2xl font-semibold mb-2">Nutrition Information:</h3>
          <ul className="list-none mb-4">
            {Object.entries(nutrition).map(([key, value]) => (
              value && <li key={key} className="mb-1"><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </>
      )}
      {keywords && <p className="text-sm text-gray-600">Keywords: {keywords}</p>}
    </div>
  );
};

export default Recipe;
