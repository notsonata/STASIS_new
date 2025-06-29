package com.stasis.stasis.service;

import com.stasis.stasis.model.CourseSection;
import com.stasis.stasis.model.Schedule;
import com.stasis.stasis.repository.CourseSectionRepository;
import com.stasis.stasis.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CourseSectionService {

    @Autowired
    private CourseSectionRepository courseSectionRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<CourseSection> getAllSections() {
        return courseSectionRepository.findAll();
    }

    public Optional<CourseSection> getSectionById(Long id) {
        return courseSectionRepository.findById(id);
    }

    @Transactional
    public CourseSection createSection(CourseSection section) {
        // First save the CourseSection
        CourseSection savedSection = courseSectionRepository.save(section);
        
        // If there are any schedules, set their courseSection reference and save them
        if (section.getSchedules() != null) {
            section.getSchedules().forEach(schedule -> {
                schedule.setCourseSection(savedSection);
                scheduleRepository.save(schedule);
            });
        }
        
        return savedSection;
    }

    @Transactional
    public CourseSection updateSection(Long id, CourseSection updatedSection) {
        return courseSectionRepository.findById(id)
            .map(section -> {
                section.setCourse(updatedSection.getCourse());
                section.setFaculty(updatedSection.getFaculty());
                section.setSectionName(updatedSection.getSectionName());
                section.setSemester(updatedSection.getSemester());
                section.setYear(updatedSection.getYear());
                
                // Update schedules if provided
                if (updatedSection.getSchedules() != null) {
                    // Remove old schedules
                    scheduleRepository.deleteAll(section.getSchedules());
                    
                    // Add new schedules
                    updatedSection.getSchedules().forEach(schedule -> {
                        schedule.setCourseSection(section);
                        scheduleRepository.save(schedule);
                    });
                    section.setSchedules(updatedSection.getSchedules());
                }
                
                return courseSectionRepository.save(section);
            })
            .orElseThrow(() -> new RuntimeException("Section not found with ID " + id));
    }

    @Transactional
    public void deleteSection(Long id) {
        courseSectionRepository.findById(id).ifPresent(section -> {
            // Delete associated schedules first
            if (section.getSchedules() != null) {
                scheduleRepository.deleteAll(section.getSchedules());
            }
            // Then delete the section
            courseSectionRepository.delete(section);
        });
    }

    // Additional service methods
    public List<CourseSection> getSectionsByStatus(String status) {
        return scheduleRepository.findByStatus(status).stream()
            .map(schedule -> schedule.getCourseSection())
            .distinct()
            .toList();
    }

    public List<CourseSection> getSectionsByDay(String day) {
        return scheduleRepository.findByDay(day).stream()
            .map(schedule -> schedule.getCourseSection())
            .distinct()
            .toList();
    }

    public List<CourseSection> getSectionsBySectionName(String sectionName) {
        return courseSectionRepository.findBySectionName(sectionName);
    }

    public List<CourseSection> getActiveSections() {
        return scheduleRepository.findByStatus("ACTIVE").stream()
            .map(schedule -> schedule.getCourseSection())
            .distinct()
            .toList();
    }

    public List<CourseSection> getSectionsByProgram(Long programId) {
        return courseSectionRepository.findByProgramProgramID(programId);
    }

    @Transactional
    public CourseSection updateSectionStatus(Long id, String status) {
        CourseSection section = courseSectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Section not found with ID " + id));
            
        // Update status for all schedules in the section
        if (section.getSchedules() != null) {
            section.getSchedules().forEach(schedule -> {
                schedule.setStatus(status);
                scheduleRepository.save(schedule);
            });
        }
        
        return section;
    }
}
