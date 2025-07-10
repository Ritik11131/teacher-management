'use client';

import React, { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    MoreHorizontal,
    Edit3,
    Trash2,
    Eye,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Star,
    Clock,
    GraduationCap,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

// Type definitions
interface Teacher {
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

interface TeacherFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    experience: number | string;
    location: string;
    specializations: string[];
}

// Mock data
const mockTeachers: Teacher[] = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '+1 (555) 123-4567',
        subject: 'Mathematics',
        experience: 8,
        rating: 4.9,
        status: 'active',
        avatar: '/api/placeholder/40/40',
        joinDate: '2020-09-15',
        location: 'New York, NY',
        studentsCount: 120,
        classesCount: 6,
        specializations: ['Algebra', 'Calculus', 'Statistics']
    },
    {
        id: '2',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@school.edu',
        phone: '+1 (555) 234-5678',
        subject: 'Physics',
        experience: 12,
        rating: 4.8,
        status: 'active',
        avatar: '/api/placeholder/40/40',
        joinDate: '2018-01-20',
        location: 'California, CA',
        studentsCount: 98,
        classesCount: 4,
        specializations: ['Quantum Physics', 'Thermodynamics', 'Mechanics']
    },
    {
        id: '3',
        name: 'Ms. Emily Rodriguez',
        email: 'emily.rodriguez@school.edu',
        phone: '+1 (555) 345-6789',
        subject: 'English Literature',
        experience: 6,
        rating: 4.7,
        status: 'active',
        avatar: '/api/placeholder/40/40',
        joinDate: '2021-08-10',
        location: 'Texas, TX',
        studentsCount: 85,
        classesCount: 5,
        specializations: ['Poetry', 'Drama', 'Creative Writing']
    },
    {
        id: '4',
        name: 'Dr. James Wilson',
        email: 'james.wilson@school.edu',
        phone: '+1 (555) 456-7890',
        subject: 'Chemistry',
        experience: 15,
        rating: 4.9,
        status: 'inactive',
        avatar: '/api/placeholder/40/40',
        joinDate: '2015-03-05',
        location: 'Florida, FL',
        studentsCount: 110,
        classesCount: 7,
        specializations: ['Organic Chemistry', 'Biochemistry', 'Analytical Chemistry']
    },
    {
        id: '5',
        name: 'Ms. Lisa Park',
        email: 'lisa.park@school.edu',
        phone: '+1 (555) 567-8901',
        subject: 'History',
        experience: 4,
        rating: 4.6,
        status: 'pending',
        avatar: '/api/placeholder/40/40',
        joinDate: '2023-09-01',
        location: 'Illinois, IL',
        studentsCount: 75,
        classesCount: 3,
        specializations: ['World History', 'American History', 'Ancient Civilizations']
    }
];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'History', 'Geography', 'Computer Science'];

const ModernTeacherManagement: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState<TeacherFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        experience: 0,
        location: '',
        specializations: []
    });


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);



    const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

    // Filter teachers based on search and filters
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
        const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;

        return matchesSearch && matchesStatus && matchesSubject;
    });


    // Initialize form data for editing
    const initializeEditForm = (teacher: Teacher) => {
        setFormData({
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            subject: teacher.subject,
            experience: teacher.experience,
            location: teacher.location,
            specializations: teacher.specializations
        });
        setEditingTeacher(teacher);
        setIsEditModalOpen(true);
        setErrors({});
    };


    // Handle edit form submission
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !editingTeacher) return;

        const updatedTeacher: Teacher = {
            ...editingTeacher,
            ...formData,
            experience: Number(formData.experience),
        };

        setTeachers(teachers.map(teacher =>
            teacher.id === editingTeacher.id ? updatedTeacher : teacher
        ));

        setIsEditModalOpen(false);
        setEditingTeacher(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            experience: 0,
            location: '',
            specializations: []
        });
        setErrors({});
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (!teacherToDelete) return;

        setTeachers(teachers.filter(teacher => teacher.id !== teacherToDelete.id));
        setIsDeleteModalOpen(false);
        setTeacherToDelete(null);

        // Close detail modal if the deleted teacher was being viewed
        if (selectedTeacher && selectedTeacher.id === teacherToDelete.id) {
            setIsDetailModalOpen(false);
            setSelectedTeacher(null);
        }
    };

    // Statistics
    const stats = {
        total: teachers.length,
        active: teachers.filter(t => t.status === 'active').length,
        inactive: teachers.filter(t => t.status === 'inactive').length,
        pending: teachers.filter(t => t.status === 'pending').length,
        avgRating: teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length
    };

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Partial<TeacherFormData> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (Number(formData.experience) < 0) newErrors.experience = 'Experience must be positive';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newTeacher: Teacher = {
            id: Date.now().toString(),
            ...formData,
            experience: Number(formData.experience),
            rating: 4.0,
            status: 'pending',
            avatar: '/api/placeholder/40/40',
            joinDate: new Date().toISOString().split('T')[0],
            studentsCount: 0,
            classesCount: 0
        };

        setTeachers([...teachers, newTeacher]);
        setIsAddModalOpen(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            experience: 0,
            location: '',
            specializations: []
        });
    };

    // Status badge component
    const StatusBadge: React.FC<{ status: Teacher['status'] }> = ({ status }) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            inactive: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Rating component
    const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                ))}
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
                                <p className="text-gray-600">Manage your educational staff efficiently</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Teacher
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Teachers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Inactive</p>
                                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Rating</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</p>
                            </div>
                            <Star className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teachers by name, subject, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Teachers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {teacher.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                                            <p className="text-sm text-gray-600">{teacher.subject}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <StatusBadge status={teacher.status} />
                                        <RatingStars rating={teacher.rating} />
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {teacher.experience} years experience
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {teacher.location}
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Users className="w-4 h-4 mr-1" />
                                            {teacher.studentsCount} students
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            {teacher.classesCount} classes
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {teacher.specializations.slice(0, 2).map((spec) => (
                                            <span
                                                key={spec}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                        {teacher.specializations.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                +{teacher.specializations.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setSelectedTeacher(teacher);
                                            setIsDetailModalOpen(true);
                                        }}
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => initializeEditForm(teacher)}
                                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Edit3 className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTeachers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No teachers found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Add Teacher Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter phone number"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience (years) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.experience ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Years of experience"
                                    />
                                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter location"
                                    />
                                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Add Teacher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Teacher Detail Modal */}
            {isDetailModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedTeacher.name.charAt(0)}
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                                    <p className="text-lg text-gray-600">{selectedTeacher.subject}</p>
                                    <div className="mt-2">
                                        <StatusBadge status={selectedTeacher.status} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {selectedTeacher.email}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {selectedTeacher.phone}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {selectedTeacher.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Experience & Rating</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {selectedTeacher.experience} years experience
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Star className="w-4 h-4 mr-2" />
                                                <RatingStars rating={selectedTeacher.rating} />
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Joined: {new Date(selectedTeacher.joinDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Teaching Statistics</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Students</span>
                                                <span className="font-semibold">{selectedTeacher.studentsCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Classes</span>
                                                <span className="font-semibold">{selectedTeacher.classesCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Experience</span>
                                                <span className="font-semibold">{selectedTeacher.experience} years</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTeacher.specializations.map((spec) => (
                                                <span
                                                    key={spec}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            initializeEditForm(selectedTeacher);
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Teacher
                                    </button>
                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Message
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTeacherToDelete(selectedTeacher);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Edit Teacher Modal */}
            {isEditModalOpen && editingTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Edit Teacher</h2>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingTeacher(null);
                                        setErrors({});
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter phone number"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience (years) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.experience ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Years of experience"
                                    />
                                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter location"
                                    />
                                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingTeacher(null);
                                        setErrors({});
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Update Teacher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && teacherToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Delete Teacher
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold">{teacherToDelete.name}</span>?
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setTeacherToDelete(null);
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernTeacherManagement;