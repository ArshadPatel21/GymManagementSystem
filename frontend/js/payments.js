async function loadPayments() {
    try {
        const { data } = await api.getPayments();
        const tbody = document.getElementById('paymentsTable');

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No payment records found. Click "Record Payment" to add one.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(p => `
            <tr>
                <td>${p.member_name}</td>
                <td>₹${Number(p.amount).toFixed(2)}</td>
                <td>${new Date(p.payment_date).toLocaleDateString()}</td>
                <td>${p.payment_method}</td>
                <td><span class="badge ${p.status === 'Paid' ? 'badge-success' : p.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">${p.status}</span></td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editPayment(${p.payment_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePayment(${p.payment_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadMembersDropdownForPayments() {
    try {
        const { data } = await api.getMembers();
        const select = document.getElementById('paymentMemberSelect');
        select.innerHTML = '<option value="">-- Select Member --</option>' +
            data.map(m => `<option value="${m.member_id}">${m.name}</option>`).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openPaymentModal() {
    document.getElementById('paymentModalTitle').textContent = 'Record Payment';
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentId').value = '';
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

async function editPayment(id) {
    try {
        const { data } = await api.getPayments();
        const record = data.find(p => p.payment_id === id);
        if (!record) return;

        document.getElementById('paymentModalTitle').textContent = 'Edit Payment';
        document.getElementById('paymentId').value = record.payment_id;
        document.getElementById('paymentMemberSelect').value = record.member_id;
        document.getElementById('paymentAmount').value = record.amount;
        document.getElementById('paymentDate').value = record.payment_date.split('T')[0];
        document.getElementById('paymentMethod').value = record.payment_method;
        document.getElementById('paymentStatus').value = record.status;
        document.getElementById('paymentModal').classList.add('active');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
        await api.deletePayment(id);
        showToast('Payment record deleted successfully');
        loadPayments();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('paymentId').value;

    const payload = {
        member_id: document.getElementById('paymentMemberSelect').value,
        amount: document.getElementById('paymentAmount').value,
        payment_date: document.getElementById('paymentDate').value,
        payment_method: document.getElementById('paymentMethod').value,
        status: document.getElementById('paymentStatus').value
    };

    try {
        if (id) {
            await api.updatePayment(id, payload);
            showToast('Payment updated successfully');
        } else {
            await api.createPayment(payload);
            showToast('Payment recorded successfully');
        }
        closePaymentModal();
        loadPayments();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadMembersDropdownForPayments();
    loadPayments();
});
