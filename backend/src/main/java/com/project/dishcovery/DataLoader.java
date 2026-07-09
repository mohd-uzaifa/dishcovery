package com.project.dishcovery;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final RecipeRepository recipeRepository;

    public DataLoader(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        long count = recipeRepository.count();

        if (count > 0) {
            System.out.println("Recipes already loaded (" + count + " found). Skipping import.");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        InputStream inputStream = new ClassPathResource("recipes1.json").getInputStream();

        List<Recipe> recipes = mapper.readValue(
                inputStream,
                mapper.getTypeFactory().constructCollectionType(List.class, Recipe.class)
        );

        int batchSize = 200;
        int total = recipes.size();

        for (int i = 0; i < total; i += batchSize) {
            int end = Math.min(i + batchSize, total);
            List<Recipe> batch = recipes.subList(i, end);
            recipeRepository.saveAll(batch);
            System.out.println("Imported " + end + " / " + total + " recipes...");
        }

        System.out.println("Finished importing all " + total + " recipes into MySQL.");
    }
}