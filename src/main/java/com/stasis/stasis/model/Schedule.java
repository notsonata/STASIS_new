package com.stasis.stasis.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleID;

    // Many schedules can belong to one course section
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_section_id", nullable = false)
    @JsonIgnore
    private CourseSection courseSection;

    // One-to-one relationship with Course
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // Schedule fields extracted from CourseSection
    private LocalTime startTime;
    private LocalTime endTime;
    private String day; // e.g., "MWF", "TTH", "MONDAY", etc.
    private String status; // e.g., "ACTIVE", "CANCELLED", "FULL", etc.
    private String room;

    // Additional metadata
    private String semester;
    private int year;
}
