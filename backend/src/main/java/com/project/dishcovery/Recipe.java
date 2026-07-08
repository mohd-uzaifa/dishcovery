package com.project.dishcovery;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    private long id;

    @Column(nullable = false)
    private String name;


    @Column(columnDefinition = "TEXT")
    private String description;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> ingredients;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> steps;

    private String diet;
    private String course;
    private String cuisine;

    @JsonProperty("prep_time")
    private String prepTime;
    private String image;

    public Recipe(){

    }

    public Recipe(long id, String name, String description, List<String> ingredients, List<String> steps, String diet, String course, String cuisine, String prep_Time, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.steps = steps;
        this.diet = diet;
        this.course = course;
        this.cuisine = cuisine;
        this.prepTime = prep_Time;
        this.image = image;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    public String getDiet() {
        return diet;
    }

    public void setDiet(String diet) {
        this.diet = diet;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(String prepTime) {
        this.prepTime = prepTime;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Recipe Recipe = (Recipe) o;
        return id == Recipe.id && Objects.equals(name, Recipe.name) && Objects.equals(description, Recipe.description) && Objects.equals(ingredients, Recipe.ingredients) && Objects.equals(steps, Recipe.steps) && Objects.equals(diet, Recipe.diet) && Objects.equals(course, Recipe.course) && Objects.equals(cuisine, Recipe.cuisine) && Objects.equals(prepTime, Recipe.prepTime) && Objects.equals(image, Recipe.image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, ingredients, steps, diet, course, cuisine, prepTime, image);
    }
}

