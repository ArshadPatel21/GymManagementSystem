// =========================================================
// Members Page Logic
// =========================================================
let membershipPlans = [];
let trainersList = [];

async function loadMembers() {
    try {
        const { data } = await api.getMembers();
        const tbody = document.getElementById('membersTable');

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No members found. Click "Add Member" to create one.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(m => `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.phone || '-'}</td>
                <td>${m.plan_name || '-'}</td>
                <td>${m.trainer_name || '-'}</td>
                <td><span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-danger'}">${m.status}</span></td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editMember(${m.member_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMember(${m.member_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadDropdowns() {
    try {
        const [membershipsRes, trainersRes] = await Promise.all([api.getMemberships(), api.getTrainers()]);
        membershipPlans = membershipsRes.data;
        trainersList = trainersRes.data;

        const membershipSelect = document.getElementById('membership_id');
        membershipSelect.innerHTML = '<option value="">-- Select Plan --</option>' +
            membershipPlans.map(p => `<option value="${p.membership_id}">${p.plan_name}</option>`).join('');

        const trainerSelect = document.getElementById('trainer_id');
        trainerSelect.innerHTML = '<option value="">-- Select Trainer --</option>' +
            trainersList.map(t => `<option value="${t.trainer_id}">${t.name}</option>`).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openMemberModal() {
    document.getElementById('memberModalTitle').textContent = 'Add Member';
    document.getElementById('memberForm').reset();
    document.getElementById('memberId').value = '';
    document.getElementById('memberModal').classList.add('active');
}

function closeMemberModal() {
    document.getElementById('memberModal').classList.remove('active');
}

async function editMember(id) {
    try {
        const { data: m } = await api.getMember(id);
        document.getElementById('memberModalTitle').textContent = 'Edit Member';
        document.getElementById('memberId').value = m.member_id;
        document.getElementById('name').value = m.name;
        document.getElementById('email').value = m.email;
        document.getElementById('phone').value = m.phone || '';
        document.getElementById('gender').value = m.gender || 'Male';
        document.getElementById('dob').value = m.dob ? m.dob.split('T')[0] : '';
        document.getElementById('membership_id').value = m.membership_id || '';
        document.getElementById('trainer_id').value = m.trainer_id || '';
        document.getElementById('status').value = m.status;
        document.getElementById('address').value = m.address || '';
        document.getElementById('memberModal').classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
        await api.deleteMember(id);
        showToast('Member deleted successfully');
        loadMembers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('memberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('memberId').value;

    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value || null,
        membership_id: document.getElementById('membership_id').value || null,
        trainer_id: document.getElementById('trainer_id').value || null,
        status: document.getElementById('status').value,
        address: document.getElementById('address').value
    };

    try {
        if (id) {
            await api.updateMember(id, payload);
            showToast('Member updated successfully');
        } else {
            await api.createMember(payload);
            showToast('Member created successfully');
        }
        closeMemberModal();
        loadMembers();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadDropdowns();
    loadMembers();
});
