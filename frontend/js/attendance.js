// =========================================================
// Attendance Page Logic
// =========================================================
let membersForAttendance = [];

async function loadAttendance() {
    try {
        const { data } = await api.getAttendance();
        const tbody = document.getElementById('attendanceTable');

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No attendance records found. Click "Mark Attendance" to add one.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(a => `
            <tr>
                <td>${a.member_name}</td>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td>${a.check_in_time || '-'}</td>
                <td><span class="badge ${a.status === 'Present' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editAttendance(${a.attendance_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAttendance(${a.attendance_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadMembersDropdown() {
    try {
        const { data } = await api.getMembers();
        membersForAttendance = data;
        const select = document.getElementById('memberSelect');
        select.innerHTML = '<option value="">-- Select Member --</option>' +
            data.map(m => `<option value="${m.member_id}">${m.name}</option>`).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openAttendanceModal() {
    document.getElementById('attendanceModalTitle').textContent = 'Mark Attendance';
    document.getElementById('attendanceForm').reset();
    document.getElementById('attendanceId').value = '';
    // Default date to today
    document.getElementById('attendanceDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceModal').classList.add('active');
}

function closeAttendanceModal() {
    document.getElementById('attendanceModal').classList.remove('active');
}

async function editAttendance(id) {
    // Find record from the currently loaded table data by re-fetching (simple approach)
    try {
        const { data } = await api.getAttendance();
        const record = data.find(a => a.attendance_id === id);
        if (!record) return;

        document.getElementById('attendanceModalTitle').textContent = 'Edit Attendance';
        document.getElementById('attendanceId').value = record.attendance_id;
        document.getElementById('memberSelect').value = record.member_id;
        document.getElementById('attendanceDate').value = record.date.split('T')[0];
        document.getElementById('checkInTime').value = record.check_in_time || '';
        document.getElementById('attendanceStatus').value = record.status;
        document.getElementById('attendanceModal').classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteAttendance(id) {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    try {
        await api.deleteAttendance(id);
        showToast('Attendance record deleted successfully');
        loadAttendance();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('attendanceId').value;

    const payload = {
        member_id: document.getElementById('memberSelect').value,
        date: document.getElementById('attendanceDate').value,
        check_in_time: document.getElementById('checkInTime').value || null,
        status: document.getElementById('attendanceStatus').value
    };

    try {
        if (id) {
            await api.updateAttendance(id, payload);
            showToast('Attendance updated successfully');
        } else {
            await api.markAttendance(payload);
            showToast('Attendance marked successfully');
        }
        closeAttendanceModal();
        loadAttendance();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadMembersDropdown();
    loadAttendance();
});
