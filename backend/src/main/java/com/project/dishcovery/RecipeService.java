package com.project.dishcovery;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {
    private RecipeRepository recipeRepository;
    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }
    public List<Recipe> searchByName(String name) {
        return recipeRepository.findByNameContainingIgnoreCase(name);
    }
    public List<Recipe> searchByFilters(List<String> selectedIngredients,String diet, String course) {
        List<Recipe> candidates;
        boolean hasDiet=diet!=null&& !diet.isBlank();
        boolean hasCourse=course!=null&& !course.isBlank();

        if(hasDiet&&hasCourse){
            candidates=recipeRepository.findByDietAndCourse(diet, course);
        } else if(hasDiet){
            candidates=recipeRepository.findByDiet(diet);
        } else if(hasCourse){
            candidates=recipeRepository.findByCourse(course);
        } else {
            candidates=recipeRepository.findAll();
        }
        if(selectedIngredients!=null&& !selectedIngredients.isEmpty()){
            candidates=candidates.stream().filter(recipe -> matchesAllIngredients(recipe,selectedIngredients)).toList();
        }
        return candidates;
    }
    private boolean matchesAllIngredients(Recipe recipe, List<String> selectedIngredients) {
        if(recipe.getIngredients()== null) return false;
        String recipeIngredientsText=String.join(",", recipe.getIngredients()).toLowerCase();
        for(String selected:selectedIngredients){
            if(!recipeIngredientsText.contains(selected.toLowerCase())){
                return false;
            }
        }
        return true;
    }
}
