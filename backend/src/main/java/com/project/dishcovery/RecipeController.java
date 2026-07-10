package com.project.dishcovery;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeService recipeService, RecipeRepository recipeRepository) {
        this.recipeService = recipeService;
        this.recipeRepository = recipeRepository;
    }

    @GetMapping
    public List<RecipeSummaryDTO> getAllRecipes() {
        return recipeRepository.findAll().stream().map(RecipeSummaryDTO::new).toList();
    }

    @GetMapping("/{id}")
    public Recipe getRecipeById(@PathVariable long id) {
        return recipeRepository.findById(id).orElse(null);
    }

    @GetMapping("/search-by-name")
    public List<Recipe> searchByName(@RequestParam String name) {
        return recipeService.searchByName(name);
    }
    @GetMapping("/filter")
    public List<Recipe> filterRecipes(
            @RequestParam(required = false) List<String> ingredients,
            @RequestParam(required = false) String diet,
            @RequestParam(required = false) String course
    ) {
        List<Recipe> result = recipeService.searchByFilters(ingredients, diet, course);
        return result;
    }
    @GetMapping("/region")
    public List<Recipe> getByRegion(@RequestParam String cuisine) {
        return recipeRepository.findByCuisine(cuisine);
    }

}


