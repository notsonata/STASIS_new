package com.stasis.stasis.service;

import com.stasis.stasis.model.Faculty;
import com.stasis.stasis.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }

    public Faculty createFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public Faculty updateFaculty(Long id, Faculty updatedFaculty) {
        return facultyRepository.findById(id)
            .map(faculty -> {
                faculty.setFirstName(updatedFaculty.getFirstName());
                faculty.setLastName(updatedFaculty.getLastName());
                faculty.setEmail(updatedFaculty.getEmail());
                faculty.setStatus(updatedFaculty.getStatus());
                faculty.setPosition(updatedFaculty.getPosition()); // Add position field
                faculty.setProgram(updatedFaculty.getProgram());
                return facultyRepository.save(faculty);
            })
            .orElseThrow(() -> new RuntimeException("Faculty not found with ID " + id));
    }

    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }

    // Add new service methods for Faculty-specific operations
    public List<Faculty> getFacultyByProgram(Long programId) {
        return facultyRepository.findByProgram_ProgramID(programId);
    }

    public List<Faculty> getFacultyByStatus(String status) {
        return facultyRepository.findByStatus(status);
    }

    public List<Faculty> getFacultyByPosition(String position) {
        return facultyRepository.findByPosition(position);
    }

    public List<Faculty> searchFacultyByName(String searchTerm) {
        return facultyRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            searchTerm, searchTerm);
    }

    public List<Faculty> getActiveFaculty() {
        return facultyRepository.findByStatus("Active");
    }

    public Faculty updateFacultyStatus(Long id, String status) {
        return facultyRepository.findById(id)
            .map(faculty -> {
                faculty.setStatus(status);
                return facultyRepository.save(faculty);
            })
            .orElseThrow(() -> new RuntimeException("Faculty not found with ID " + id));
    }

    public boolean existsByEmail(String email) {
        return facultyRepository.existsByEmail(email);
    }

    public Optional<Faculty> getFacultyByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }
}
