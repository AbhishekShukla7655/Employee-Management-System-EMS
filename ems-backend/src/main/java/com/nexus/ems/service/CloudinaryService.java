package com.nexus.ems.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "ems/" + folder,
                            "width", 400,
                            "height", 400,
                            "crop", "fill",
                            "resource_type", "image"));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank())
            return;
        try {
            // Extract public_id from URL
            String[] parts = imageUrl.split("/");
            String publicIdWithExt = parts[parts.length - 1];
            String folder = parts[parts.length - 2];
            String publicId = "ems/" + folder + "/" + publicIdWithExt.split("\\.")[0];
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.warn("Could not delete old image from Cloudinary: {}", e.getMessage());
        }
    }
}
