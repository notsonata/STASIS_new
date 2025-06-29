package com.stasis.stasis.service;

import com.stasis.stasis.model.Schedule;
import com.stasis.stasis.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Basic CRUD operations
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(Long id, Schedule updatedSchedule) {
        return scheduleRepository.findById(id)
            .map(schedule -> {
                schedule.setCourseSection(updatedSchedule.getCourseSection());
                schedule.setCourse(updatedSchedule.getCourse());
                schedule.setStartTime(updatedSchedule.getStartTime());
                schedule.setEndTime(updatedSchedule.getEndTime());
                schedule.setDay(updatedSchedule.getDay());
                schedule.setStatus(updatedSchedule.getStatus());
                schedule.setRoom(updatedSchedule.getRoom());
                schedule.setSemester(updatedSchedule.getSemester());
                schedule.setYear(updatedSchedule.getYear());
                return scheduleRepository.save(schedule);
            })
            .orElseThrow(() -> new RuntimeException("Schedule not found with ID " + id));
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    // Query methods
    public List<Schedule> getSchedulesByCourseSectionId(Long courseSectionId) {
        return scheduleRepository.findByCourseSectionSectionID(courseSectionId);
    }

    public List<Schedule> getSchedulesByCourseId(Long courseId) {
        return scheduleRepository.findByCourseId(courseId);
    }

    public List<Schedule> getSchedulesByStatus(String status) {
        return scheduleRepository.findByStatus(status);
    }

    public List<Schedule> getSchedulesByDay(String day) {
        return scheduleRepository.findByDay(day);
    }

    public List<Schedule> getSchedulesByRoom(String room) {
        return scheduleRepository.findByRoom(room);
    }

    public List<Schedule> getSchedulesBySemesterAndYear(String semester, int year) {
        return scheduleRepository.findBySemesterAndYear(semester, year);
    }

    public List<Schedule> getActiveSchedules() {
        return scheduleRepository.findByStatus("ACTIVE");
    }

    public List<Schedule> getActiveSchedulesWithDetails() {
        return scheduleRepository.findActiveSchedulesWithDetails("ACTIVE");
    }

    public List<Schedule> getSchedulesByFacultyId(Long facultyId) {
        return scheduleRepository.findByFacultyId(facultyId);
    }

    public List<Schedule> getSchedulesByProgramId(Long programId) {
        return scheduleRepository.findByProgramId(programId);
    }

    // Business logic methods
    public Schedule updateScheduleStatus(Long id, String status) {
        return scheduleRepository.findById(id)
            .map(schedule -> {
                schedule.setStatus(status);
                return scheduleRepository.save(schedule);
            })
            .orElseThrow(() -> new RuntimeException("Schedule not found with ID " + id));
    }

    public boolean hasTimeConflict(String day, String room, LocalTime startTime, LocalTime endTime) {
        List<Schedule> conflictingSchedules = scheduleRepository.findConflictingSchedules(day, room, startTime, endTime);
        return !conflictingSchedules.isEmpty();
    }

    public List<Schedule> findConflictingSchedules(String day, String room, LocalTime startTime, LocalTime endTime) {
        return scheduleRepository.findConflictingSchedules(day, room, startTime, endTime);
    }

    // Validation method
    public void validateSchedule(Schedule schedule) {
        if (schedule.getStartTime() == null || schedule.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }
        if (schedule.getStartTime().isAfter(schedule.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        if (schedule.getDay() == null || schedule.getDay().trim().isEmpty()) {
            throw new IllegalArgumentException("Day is required");
        }
        if (schedule.getRoom() == null || schedule.getRoom().trim().isEmpty()) {
            throw new IllegalArgumentException("Room is required");
        }
        if (schedule.getCourse() == null) {
            throw new IllegalArgumentException("Course is required");
        }
        if (schedule.getCourseSection() == null) {
            throw new IllegalArgumentException("Course section is required");
        }
    }
}
