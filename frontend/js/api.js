// =========================================================
// API Helper - Wraps fetch() calls to the backend REST API
// =========================================================
const BASE_URL = '/api';

async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

const api = {
    // Members
    getMembers: () => apiRequest('/members'),
    getMember: (id) => apiRequest(`/members/${id}`),
    createMember: (data) => apiRequest('/members', 'POST', data),
    updateMember: (id, data) => apiRequest(`/members/${id}`, 'PUT', data),
    deleteMember: (id) => apiRequest(`/members/${id}`, 'DELETE'),

    // Trainers
    getTrainers: () => apiRequest('/trainers'),
    getTrainer: (id) => apiRequest(`/trainers/${id}`),
    createTrainer: (data) => apiRequest('/trainers', 'POST', data),
    updateTrainer: (id, data) => apiRequest(`/trainers/${id}`, 'PUT', data),
    deleteTrainer: (id) => apiRequest(`/trainers/${id}`, 'DELETE'),

    // Memberships
    getMemberships: () => apiRequest('/memberships'),
    getMembership: (id) => apiRequest(`/memberships/${id}`),
    createMembership: (data) => apiRequest('/memberships', 'POST', data),
    updateMembership: (id, data) => apiRequest(`/memberships/${id}`, 'PUT', data),
    deleteMembership: (id) => apiRequest(`/memberships/${id}`, 'DELETE'),

    // Attendance
    getAttendance: () => apiRequest('/attendance'),
    getMemberAttendance: (memberId) => apiRequest(`/attendance/member/${memberId}`),
    markAttendance: (data) => apiRequest('/attendance', 'POST', data),
    updateAttendance: (id, data) => apiRequest(`/attendance/${id}`, 'PUT', data),
    deleteAttendance: (id) => apiRequest(`/attendance/${id}`, 'DELETE'),

    // Payments
    getPayments: () => apiRequest('/payments'),
    getMemberPayments: (memberId) => apiRequest(`/payments/member/${memberId}`),
    createPayment: (data) => apiRequest('/payments', 'POST', data),
    updatePayment: (id, data) => apiRequest(`/payments/${id}`, 'PUT', data),
    deletePayment: (id) => apiRequest(`/payments/${id}`, 'DELETE')
};

// ---------------------------------------------------------
// Toast notification helper (used across all pages)
// ---------------------------------------------------------
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
