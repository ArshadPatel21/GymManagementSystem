async function loadTrainers() {
    try {
        const { data } = await api.getTrainers();
        const tbody = document.getElementById('trainersTable');

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No trainers found. Click "Add Trainer" to create one.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(t => `
            <tr>
                <td>${t.name}</td>
                <td>${t.email}</td>
                <td>${t.phone || '-'}</td>
                <td>${t.specialization || '-'}</td>
                <td>${t.salary ? '₹' + Number(t.salary).toFixed(2) : '-'}</td>
                <td>${t.joining_date ? new Date(t.joining_date).toLocaleDateString() : '-'}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editTrainer(${t.trainer_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTrainer(${t.trainer_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openTrainerModal() {
    document.getElementById('trainerModalTitle').textContent = 'Add Trainer';
    document.getElementById('trainerForm').reset();
    document.getElementById('trainerId').value = '';
    document.getElementById('trainerModal').classList.add('active');
}

function closeTrainerModal() {
    document.getElementById('trainerModal').classList.remove('active');
}

async function editTrainer(id) {
    try {
        const { data: t } = await api.getTrainer(id);
        document.getElementById('trainerModalTitle').textContent = 'Edit Trainer';
        document.getElementById('trainerId').value = t.trainer_id;
        document.getElementById('tName').value = t.name;
        document.getElementById('tEmail').value = t.email;
        document.getElementById('tPhone').value = t.phone || '';
        document.getElementById('tSpecialization').value = t.specialization || '';
        document.getElementById('tSalary').value = t.salary || '';
        document.getElementById('tJoiningDate').value = t.joining_date ? t.joining_date.split('T')[0] : '';
        document.getElementById('trainerModal').classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteTrainer(id) {
    if (!confirm('Are you sure you want to delete this trainer?')) return;
    try {
        await api.deleteTrainer(id);
        showToast('Trainer deleted successfully');
        loadTrainers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('trainerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('trainerId').value;

    const payload = {
        name: document.getElementById('tName').value,
        email: document.getElementById('tEmail').value,
        phone: document.getElementById('tPhone').value,
        specialization: document.getElementById('tSpecialization').value,
        salary: document.getElementById('tSalary').value || null,
        joining_date: document.getElementById('tJoiningDate').value || null
    };

    try {
        if (id) {
            await api.updateTrainer(id, payload);
            showToast('Trainer updated successfully');
        } else {
            await api.createTrainer(payload);
            showToast('Trainer created successfully');
        }
        closeTrainerModal();
        loadTrainers();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.addEventListener('DOMContentLoaded', loadTrainers);
