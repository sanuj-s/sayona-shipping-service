// Client Profile — shared sidebar, null-safe DOM updates

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadClientSidebar();
    loadProfile();
    initProfileForm();
});

async function loadProfile() {
    try {
        const user = await PortalAPI.getProfile();
        const avatarEl = document.getElementById('profileAvatar');
        const nameEl = document.getElementById('profileName');
        const roleEl = document.getElementById('profileRole');

        if (avatarEl) avatarEl.textContent = user.name?.charAt(0).toUpperCase() || 'U';
        if (nameEl) nameEl.textContent = user.name || '—';
        if (roleEl) roleEl.textContent = (user.role || 'Employee').charAt(0).toUpperCase() + (user.role || 'employee').slice(1);

        document.getElementById('pName').value = user.name || '';
        document.getElementById('pEmail').value = user.email || '';
        document.getElementById('pPhone').value = user.phone || '';
        document.getElementById('pCompany').value = user.company || '';
        document.getElementById('pAddress').value = user.address || '';
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveProfileBtn');
        btn.textContent = 'Saving...';
        btn.disabled = true;

        try {
            const data = {
                name: document.getElementById('pName').value,
                phone: document.getElementById('pPhone').value,
                company: document.getElementById('pCompany').value,
                address: document.getElementById('pAddress').value,
            };

            const updated = await PortalAPI.updateProfile(data);
            showToast('Profile updated successfully!', 'success');

            // Update local storage
            const oldAuth = JSON.parse(localStorage.getItem('client_user') || '{}');
            oldAuth.name = updated.name;
            localStorage.setItem('client_user', JSON.stringify(oldAuth));

            // Update page DOM
            const profileNameEl = document.getElementById('profileName');
            const profileAvatarEl = document.getElementById('profileAvatar');
            if (profileNameEl) profileNameEl.textContent = updated.name;
            if (profileAvatarEl) profileAvatarEl.textContent = updated.name.charAt(0).toUpperCase();

            // Update sidebar DOM (null-check in case sidebar hasn't loaded)
            const sidebarName = document.getElementById('sidebarUserName');
            const sidebarAvatar = document.getElementById('sidebarAvatar');
            if (sidebarName) sidebarName.textContent = updated.name;
            if (sidebarAvatar) sidebarAvatar.textContent = updated.name.charAt(0).toUpperCase();

        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            btn.textContent = 'Save Changes';
            btn.disabled = false;
        }
    });
}
