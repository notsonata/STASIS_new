package com.stasis.stasis.repository;

import com.stasis.stasis.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
    
    // Find by section name
    List<CourseSection> findBySectionName(String sectionName);
    
    // Find by semester and year
    List<CourseSection> findBySemesterAndYear(String semester, int year);
    
    // Find by course
    List<CourseSection> findByCourse_Id(Long courseId);
    
    // Find by faculty
    List<CourseSection> findByFaculty_FacultyID(Long facultyId);

    // Find by program ID
    List<CourseSection> findByProgramProgramID(Long programId);
    
    // Schedule-related methods have been moved to ScheduleRepository
    // since schedule fields are now in the Schedule entity
}
