package com.project.dishcovery;

import java.util.List;

public class RecipeSummaryDTO {
    private Long id;
    private String name;
    private String image;
    private String prepTime;
    private String diet;
    private String course;
    private List<String> ingredients;

    public RecipeSummaryDTO(Recipe recipe) {
        this.id = recipe.getId();
        this.name = recipe.getName();
        this.image = recipe.getImage();
        this.prepTime = recipe.getPrepTime();
        this.diet = recipe.getDiet();
        this.course = recipe.getCourse();
        this.ingredients = recipe.getIngredients();
    }
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getPrepTime() {
        return prepTime;
    }

    public String getDiet() {
        return diet;
    }

    public String getCourse() {
        return course;
    }

    public List<String> getIngredients() {
        return ingredients;
    }
}
