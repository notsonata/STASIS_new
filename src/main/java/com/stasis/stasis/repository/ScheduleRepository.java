package com.stasis.stasis.repository;

import com.stasis.stasis.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // Find schedules by course section
    List<Schedule> findByCourseSectionSectionID(Long courseSectionId);
    
    // Find schedules by course
    List<Schedule> findByCourseId(Long courseId);
    
    // Find schedules by status
    List<Schedule> findByStatus(String status);
    
    // Find schedules by day
    List<Schedule> findByDay(String day);
    
    // Find schedules by room
    List<Schedule> findByRoom(String room);
    
    // Find schedules by semester and year
    List<Schedule> findBySemesterAndYear(String semester, int year);
    
    // Find schedules by course section and status
    List<Schedule> findByCourseSectionSectionIDAndStatus(Long courseSectionId, String status);
    
    // Custom query to find schedules with course and section details
    @Query("SELECT s FROM Schedule s " +
           "JOIN FETCH s.course c " +
           "JOIN FETCH s.courseSection cs " +
           "WHERE s.status = :status")
    List<Schedule> findActiveSchedulesWithDetails(@Param("status") String status);
    
    // Find schedules by faculty through course section
    @Query("SELECT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "WHERE cs.faculty.facultyID = :facultyId")
    List<Schedule> findByFacultyId(@Param("facultyId") Long facultyId);
    
    // Find schedules by program through course section
    @Query("SELECT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "WHERE cs.program.programID = :programId")
    List<Schedule> findByProgramId(@Param("programId") Long programId);
    
    // Check for time conflicts
    @Query("SELECT s FROM Schedule s " +
           "WHERE s.day = :day " +
           "AND s.room = :room " +
           "AND s.status = 'ACTIVE' " +
           "AND ((s.startTime <= :startTime AND s.endTime > :startTime) " +
           "OR (s.startTime < :endTime AND s.endTime >= :endTime) " +
           "OR (s.startTime >= :startTime AND s.endTime <= :endTime))")
    List<Schedule> findConflictingSchedules(@Param("day") String day, 
                                          @Param("room") String room,
                                          @Param("startTime") java.time.LocalTime startTime,
                                          @Param("endTime") java.time.LocalTime endTime);
}
