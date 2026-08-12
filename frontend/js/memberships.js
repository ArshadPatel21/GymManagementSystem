async function loadPlans() {
    try {
        const { data } = await api.getMemberships();
        const tbody = document.getElementById('plansTable');

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No membership plans found. Click "Add Plan" to create one.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(p => `
            <tr>
                <td>${p.plan_name}</td>
                <td>${p.duration_months}</td>
                <td>₹${Number(p.price).toFixed(2)}</td>
                <td>${p.description || '-'}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editPlan(${p.membership_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlan(${p.membership_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openPlanModal() {
    document.getElementById('planModalTitle').textContent = 'Add Membership Plan';
    document.getElementById('planForm').reset();
    document.getElementById('planId').value = '';
    document.getElementById('planModal').classList.add('active');
}

function closePlanModal() {
    document.getElementById('planModal').classList.remove('active');
}

async function editPlan(id) {
    try {
        const { data: p } = await api.getMembership(id);
        document.getElementById('planModalTitle').textContent = 'Edit Membership Plan';
        document.getElementById('planId').value = p.membership_id;
        document.getElementById('planName').value = p.plan_name;
        document.getElementById('planDuration').value = p.duration_months;
        document.getElementById('planPrice').value = p.price;
        document.getElementById('planDescription').value = p.description || '';
        document.getElementById('planModal').classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deletePlan(id) {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
        await api.deleteMembership(id);
        showToast('Plan deleted successfully');
        loadPlans();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('planForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('planId').value;

    const payload = {
        plan_name: document.getElementById('planName').value,
        duration_months: document.getElementById('planDuration').value,
        price: document.getElementById('planPrice').value,
        description: document.getElementById('planDescription').value
    };

    try {
        if (id) {
            await api.updateMembership(id, payload);
            showToast('Plan updated successfully');
        } else {
            await api.createMembership(payload);
            showToast('Plan created successfully');
        }
        closePlanModal();
        loadPlans();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.addEventListener('DOMContentLoaded', loadPlans);
