// Comprehensive type definitions for the project
export interface College {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  ownership: string;
  naac_grade: string;
  nirf_ranking: number;
  established: number;
  website: string;
  email: string;
  phone: string;
  logo_url: string;
  image_url: string;
  banner_url: string;
  overview: string;
  description: string;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  name: string;
  slug: string;
  level: string;
  duration: string;
  avg_salary?: number;
}

export interface CourseOffering {
  id: number;
  college_id: number;
  course_id: number;
  course: Course;
  collegecourse_data: any;
}

export interface CollegeWithRelations extends College {
  course_offerings: CourseOffering[];
  rankings?: any[];
  admissions?: any[];
  placements?: any[];
  cutoffs?: any[];
  scholarships?: any[];
  facilities: any[];
  images?: any[];
  news?: any[];
  faqs?: any[];
  structured_data?: any;
}