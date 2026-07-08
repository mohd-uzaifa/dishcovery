package com.project.dishcovery;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByCuisine(String cuisine);
    List<Recipe> findByDiet(String diet);
    List<Recipe> findByCourse(String course);
    List<Recipe> findByDietAndCourse(String diet, String course);
    List<Recipe> findByNameContainingIgnoreCase(String name);
}
