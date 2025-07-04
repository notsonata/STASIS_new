package com.stasis.stasis.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrolledCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrolledCourseID;

    @ManyToOne
    @JoinColumn(name = "semesterEnrollmentID")
    private SemesterEnrollment semesterEnrollment;

    @ManyToOne
    @JoinColumn(name = "sectionID")
    private CourseSection section;

    private String status;

    @OneToOne
    @JoinColumn(name = "gradeID", nullable = true)
    private Grade grade;
}