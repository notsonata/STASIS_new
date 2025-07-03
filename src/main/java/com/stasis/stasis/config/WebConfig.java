package com.stasis.stasis.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.core.io.FileSystemResource;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.io.IOException;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static content from React build (CSS, JS, images)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:/app/static/static/")
                .setCachePeriod(31536000); // Cache for 1 year

        // Serve root files (favicon, manifest, etc.)
        registry.addResourceHandler("/*.ico", "/*.json", "/*.png", "/*.txt")
                .addResourceLocations("file:/app/static/")
                .setCachePeriod(3600); // Cache for 1 hour

        // Handle React Router - serve index.html for non-API routes
        registry.addResourceHandler("/**")
                .addResourceLocations("file:/app/static/")
                .resourceChain(false)
                .addResolver(new PathResourceResolver() {
                    @Override
                    @Nullable
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) throws IOException {
                        // If requesting an API endpoint, don't serve index.html
                        if (resourcePath.startsWith("api/") || 
                            resourcePath.startsWith("actuator/")) {
                            return null;
                        }

                        // Try to find the requested resource
                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // For SPA routing, serve index.html for non-file requests
                        // Check if the path looks like a file (has extension)
                        if (resourcePath.contains(".")) {
                            return null; // File not found
                        }

                        // Serve index.html for React Router paths
                        try {
                            Resource indexHtml = new FileSystemResource(Paths.get("/app/static/index.html"));
                            if (indexHtml.exists() && indexHtml.isReadable()) {
                                return indexHtml;
                            }
                        } catch (Exception e) {
                            // Log error and return null
                            System.err.println("Error serving index.html: " + e.getMessage());
                        }

                        return null;
                    }
                });
    }
}
