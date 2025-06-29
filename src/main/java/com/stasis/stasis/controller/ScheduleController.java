package com.stasis.stasis.controller;

import com.stasis.stasis.model.Schedule;
import com.stasis.stasis.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        try {
            scheduleService.validateSchedule(schedule);
            Schedule createdSchedule = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(createdSchedule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        try {
            scheduleService.validateSchedule(schedule);
            Schedule updatedSchedule = scheduleService.updateSchedule(id, schedule);
            return ResponseEntity.ok(updatedSchedule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    // Query endpoints
    @GetMapping("/course-section/{courseSectionId}")
    public ResponseEntity<List<Schedule>> getSchedulesByCourseSectionId(@PathVariable Long courseSectionId) {
        List<Schedule> schedules = scheduleService.getSchedulesByCourseSectionId(courseSectionId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Schedule>> getSchedulesByCourseId(@PathVariable Long courseId) {
        List<Schedule> schedules = scheduleService.getSchedulesByCourseId(courseId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Schedule>> getSchedulesByStatus(@PathVariable String status) {
        List<Schedule> schedules = scheduleService.getSchedulesByStatus(status);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/day/{day}")
    public ResponseEntity<List<Schedule>> getSchedulesByDay(@PathVariable String day) {
        List<Schedule> schedules = scheduleService.getSchedulesByDay(day);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/room/{room}")
    public ResponseEntity<List<Schedule>> getSchedulesByRoom(@PathVariable String room) {
        List<Schedule> schedules = scheduleService.getSchedulesByRoom(room);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/semester/{semester}/year/{year}")
    public ResponseEntity<List<Schedule>> getSchedulesBySemesterAndYear(@PathVariable String semester, @PathVariable int year) {
        List<Schedule> schedules = scheduleService.getSchedulesBySemesterAndYear(semester, year);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Schedule>> getActiveSchedules() {
        List<Schedule> schedules = scheduleService.getActiveSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/active/details")
    public ResponseEntity<List<Schedule>> getActiveSchedulesWithDetails() {
        List<Schedule> schedules = scheduleService.getActiveSchedulesWithDetails();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Schedule>> getSchedulesByFacultyId(@PathVariable Long facultyId) {
        List<Schedule> schedules = scheduleService.getSchedulesByFacultyId(facultyId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<List<Schedule>> getSchedulesByProgramId(@PathVariable Long programId) {
        List<Schedule> schedules = scheduleService.getSchedulesByProgramId(programId);
        return ResponseEntity.ok(schedules);
    }

    // Business logic endpoints
    @PutMapping("/{id}/status")
    public ResponseEntity<Schedule> updateScheduleStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Schedule updatedSchedule = scheduleService.updateScheduleStatus(id, status);
            return ResponseEntity.ok(updatedSchedule);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/conflicts")
    public ResponseEntity<List<Schedule>> findConflictingSchedules(
            @RequestParam String day,
            @RequestParam String room,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);
            List<Schedule> conflicts = scheduleService.findConflictingSchedules(day, room, start, end);
            return ResponseEntity.ok(conflicts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conflicts/check")
    public ResponseEntity<Boolean> hasTimeConflict(
            @RequestParam String day,
            @RequestParam String room,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);
            boolean hasConflict = scheduleService.hasTimeConflict(day, room, start, end);
            return ResponseEntity.ok(hasConflict);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Validation endpoint
    @PostMapping("/validate")
    public ResponseEntity<String> validateSchedule(@RequestBody Schedule schedule) {
        try {
            scheduleService.validateSchedule(schedule);
            return ResponseEntity.ok("Schedule data is valid");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
