package com.stasis.stasis.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionID;

    @ManyToOne
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne
    private Faculty faculty;

    private String sectionName; // New field for section name (e.g., "A", "B", "CS101-A")
    private String semester;
    private int year;
    
    // One-to-many relationship with Schedule
    @OneToMany(mappedBy = "courseSection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Schedule> schedules;
    
    // Schedule fields have been moved to Schedule entity
    // Removed: startTime, endTime, day, status, room
}
