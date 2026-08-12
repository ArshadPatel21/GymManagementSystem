// =========================================================
// Dashboard Page Logic
// =========================================================
async function loadDashboard() {
    try {
        const [membersRes, trainersRes, membershipsRes, paymentsRes] = await Promise.all([
            api.getMembers(),
            api.getTrainers(),
            api.getMemberships(),
            api.getPayments()
        ]);

        const members = membersRes.data;
        const trainers = trainersRes.data;
        const memberships = membershipsRes.data;
        const payments = paymentsRes.data;

        document.getElementById('statMembers').textContent = members.length;
        document.getElementById('statTrainers').textContent = trainers.length;
        document.getElementById('statMemberships').textContent = memberships.length;

        // Sum payments made in the current month
        const now = new Date();
        const monthTotal = payments
            .filter(p => {
                const d = new Date(p.payment_date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, p) => sum + Number(p.amount), 0);
        document.getElementById('statPayments').textContent = `₹${monthTotal.toFixed(2)}`;

        // Recent members table (latest 5)
        const tbody = document.getElementById('recentMembersTable');
        const recent = members.slice(0, 5);

        if (recent.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No members yet</td></tr>`;
            return;
        }

        tbody.innerHTML = recent.map(m => `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.plan_name || '-'}</td>
                <td>${m.join_date ? new Date(m.join_date).toLocaleDateString() : '-'}</td>
                <td><span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-danger'}">${m.status}</span></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
        showToast('Failed to load dashboard data', 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
