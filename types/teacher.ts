// types/teacher.ts
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  joinDate: string;
  location: string;
  studentsCount: number;
  classesCount: number;
  specializations: string[];
}

export interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: number;
  location: string;
  specializations: string[];
}

export interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  avgRating: number;
}