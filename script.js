// Data Storage Keys
const STORAGE_KEYS = {
    MACHINES: 'maasli_machines',
    STATIONS: 'maasli_stations',
    USER: 'maasli_user',
    PRODUCT_TYPES: 'maasli_product_types'
};

// Initialize sample data if not exists
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.MACHINES)) {
        const sampleMachines = [
            { id: 1, name: 'Machine 1', product: 'Product A', count: 1250 },
            { id: 2, name: 'Machine 2', product: 'Product A', count: 980 },
            { id: 3, name: 'Machine 3', product: 'Product B', count: 1520 },
            { id: 4, name: 'Machine 4', product: 'Product B', count: 1100 }
        ];
        localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(sampleMachines));
    }

    if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
        const sampleStations = [
            {
                id: 1,
                name: 'Station A',
                employees: [
                    { id: 1, name: 'Employee A', boxes: 145 },
                    { id: 2, name: 'Employee B', boxes: 132 }
                ]
            },
            {
                id: 2,
                name: 'Station B',
                employees: [
                    { id: 1, name: 'Employee A', boxes: 98 }
                ]
            },
            {
                id: 3,
                name: 'Station C',
                employees: [
                    { id: 1, name: 'Employee A', boxes: 167 },
                    { id: 2, name: 'Employee B', boxes: 154 }
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(sampleStations));
    }
}

// Get data from localStorage
function getMachines() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MACHINES) || '[]');
}

function getStations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]');
}

// Save data to localStorage
function saveMachines(machines) {
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
}

function saveStations(stations) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
}

// Login and Logout functionality will be initialized in DOMContentLoaded

// Page navigation
function showLogin() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    renderMachines();
    renderStations();
}

// Sidebar and Navigation Management
let sidebarOpen = window.innerWidth > 1024;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const mainContainer = document.querySelector('.main-container');
    
    sidebarOpen = !sidebarOpen;
    
    if (window.innerWidth <= 1024) {
        // Mobile: overlay mode
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
    } else {
        // Desktop: slide and adjust main content
        sidebar.classList.toggle('hidden');
        mainContainer.classList.toggle('sidebar-hidden');
        // On desktop, button is active when sidebar is VISIBLE (not hidden)
        if (sidebar.classList.contains('hidden')) {
            menuToggle.classList.remove('active');
        } else {
            menuToggle.classList.add('active');
        }
    }
}

// Initialize sidebar state
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    
    // Set initial state - on desktop, sidebar is visible so button should show X
    if (window.innerWidth > 1024) {
        menuToggle.classList.add('active');
    }
    
    // Menu toggle button
    menuToggle?.addEventListener('click', toggleSidebar);
    
    // Close sidebar when clicking overlay
    overlay?.addEventListener('click', toggleSidebar);
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateToPage(page);
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            sidebarOpen = true;
            // On desktop, if sidebar is not hidden, show X
            if (!sidebar.classList.contains('hidden')) {
                menuToggle.classList.add('active');
            }
        }
    });
}

// Navigation between pages
function navigateToPage(pageName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        statistics: 'Statistics',
        products: 'Products',
        profile: 'Profile'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';
    
    // Show corresponding view
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${pageName}View`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Load data for specific pages
        if (pageName === 'statistics') {
            loadStatistics('daily');
        } else if (pageName === 'products') {
            loadProducts();
        }
    }
}

// Initialize everything when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    initializeData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (user) {
        document.getElementById('userName').textContent = user;
        document.getElementById('userNameSidebar').textContent = user;
        document.getElementById('profileUserName').textContent = user;
        showDashboard();
        initSidebar();
    } else {
        showLogin();
    }
});

// Initialize all event listeners
function initializeEventListeners() {
    // Login functionality
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple demo authentication
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem(STORAGE_KEYS.USER, username);
            document.getElementById('userName').textContent = username;
            document.getElementById('userNameSidebar').textContent = username;
            document.getElementById('profileUserName').textContent = username;
            showDashboard();
            initSidebar();
        } else {
            alert('Invalid credentials. Please use: admin / admin');
        }
    });

    // Logout functionality
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.USER);
        showLogin();
    });
}

// ============================================
// MACHINES / PRODUCT COUNTS FUNCTIONALITY
// ============================================

let currentMachineId = null;

function renderMachines() {
    const machines = getMachines();
    const grid = document.getElementById('machinesGrid');
    
    if (machines.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No machines added yet. Click "Add Machine" to get started.</p>';
    } else {
        grid.innerHTML = machines.map(machine => `
            <div class="machine-card">
                <div class="machine-header">
                    <div class="machine-info">
                        <h4>${machine.name}</h4>
                        <p class="machine-product">Product: ${machine.product}</p>
                    </div>
                    <div class="machine-actions">
                        <button class="icon-btn" onclick="editMachine(${machine.id})" title="Edit">✏️</button>
                        <button class="icon-btn delete" onclick="deleteMachine(${machine.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="machine-count">${machine.count.toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    renderProductTotals();
}

function renderProductTotals() {
    const machines = getMachines();
    const totals = {};
    
    machines.forEach(machine => {
        if (totals[machine.product]) {
            totals[machine.product] += machine.count;
        } else {
            totals[machine.product] = machine.count;
        }
    });
    
    const totalsContainer = document.getElementById('productTotals');
    
    if (Object.keys(totals).length === 0) {
        totalsContainer.innerHTML = '<p style="color: var(--text-muted);">No products to display.</p>';
    } else {
        totalsContainer.innerHTML = Object.entries(totals).map(([product, count]) => `
            <div class="total-item">
                <div class="product-name">${product}</div>
                <div class="total-count">${count.toLocaleString()}</div>
            </div>
        `).join('');
    }
}

// Populate product dropdown
function populateProductDropdown() {
    const select = document.getElementById('machineProduct');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select a product...</option>';
    
    // Get all product types (saved + in use)
    const productTypes = getProductTypes();
    const machines = getMachines();
    const productsInUse = [...new Set(machines.map(m => m.product))];
    
    // Combine and deduplicate
    const allProducts = [...new Set([
        ...productTypes.map(p => p.name),
        ...productsInUse
    ])].sort();
    
    // Add all products to dropdown
    allProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        select.appendChild(option);
    });
    
    // Add "New Product" option
    const newOption = document.createElement('option');
    newOption.value = '__new__';
    newOption.textContent = '+ Add New Product';
    select.appendChild(newOption);
}

// Handle product selection change
document.getElementById('machineProduct')?.addEventListener('change', (e) => {
    const newProductInput = document.getElementById('newProductName');
    const orDivider = document.querySelector('.or-divider');
    
    if (e.target.value === '__new__') {
        newProductInput.style.display = 'block';
        orDivider.style.display = 'block';
        newProductInput.required = true;
        newProductInput.focus();
    } else {
        newProductInput.style.display = 'none';
        orDivider.style.display = 'none';
        newProductInput.required = false;
        newProductInput.value = '';
    }
});

// Add Machine button
document.getElementById('addMachineBtn')?.addEventListener('click', () => {
    currentMachineId = null;
    document.getElementById('machineId').value = '';
    document.getElementById('machineName').value = '';
    document.getElementById('machineCount').value = '0';
    document.getElementById('newProductName').value = '';
    document.getElementById('newProductName').style.display = 'none';
    document.querySelector('.or-divider').style.display = 'none';
    
    // Populate product dropdown
    populateProductDropdown();
    document.getElementById('machineProduct').value = '';
    
    // Count should be readonly - it comes from AI model
    document.getElementById('machineCount').setAttribute('readonly', 'true');
    document.getElementById('machineCount').setAttribute('disabled', 'true');
    
    document.getElementById('machineModal').classList.add('active');
});

// Edit Machine
function editMachine(id) {
    const machines = getMachines();
    const machine = machines.find(m => m.id === id);
    
    if (machine) {
        currentMachineId = id;
        document.getElementById('machineId').value = id;
        document.getElementById('machineName').value = machine.name;
        document.getElementById('machineCount').value = machine.count;
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductName').style.display = 'none';
        document.querySelector('.or-divider').style.display = 'none';
        
        // Populate product dropdown
        populateProductDropdown();
        document.getElementById('machineProduct').value = machine.product;
        
        document.getElementById('machineModal').classList.add('active');
        
        // Make count field readonly in edit mode
        document.getElementById('machineCount').setAttribute('readonly', 'true');
        document.getElementById('machineCount').setAttribute('disabled', 'true');
    }
}

// Delete Machine
function deleteMachine(id) {
    if (confirm('Are you sure you want to delete this machine?')) {
        let machines = getMachines();
        machines = machines.filter(m => m.id !== id);
        saveMachines(machines);
        renderMachines();
    }
}

// Save Machine
document.getElementById('machineForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('machineName').value;
    let product = document.getElementById('machineProduct').value;
    const newProductName = document.getElementById('newProductName').value;
    
    // If "Add New Product" was selected, use the new product name
    if (product === '__new__') {
        if (!newProductName.trim()) {
            alert('Please enter a new product name');
            return;
        }
        product = newProductName.trim();
    }
    
    if (!product) {
        alert('Please select or enter a product name');
        return;
    }
    
    let machines = getMachines();
    
    if (currentMachineId) {
        // Update existing machine - ONLY update name and product, keep count from AI
        const index = machines.findIndex(m => m.id === currentMachineId);
        if (index !== -1) {
            machines[index] = { ...machines[index], name, product };
            // count stays the same - it comes from AI model
        }
    } else {
        // Add new machine - starts with 0 count, will be updated by AI
        const newId = machines.length > 0 ? Math.max(...machines.map(m => m.id)) + 1 : 1;
        machines.push({ id: newId, name, product, count: 0 });
    }
    
    saveMachines(machines);
    renderMachines();
    closeMachineModal();
});

// Cancel Machine Modal
document.getElementById('cancelMachineBtn')?.addEventListener('click', closeMachineModal);

function closeMachineModal() {
    document.getElementById('machineModal').classList.remove('active');
    currentMachineId = null;
}

// Close modal on outside click
document.getElementById('machineModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'machineModal') {
        closeMachineModal();
    }
});

// ============================================
// STATIONS / EMPLOYEE STATS FUNCTIONALITY
// ============================================

let currentStationId = null;

function renderStations() {
    const stations = getStations();
    const container = document.getElementById('stationsContainer');
    
    if (stations.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No stations added yet. Click "Add Station" to get started.</p>';
    } else {
        container.innerHTML = stations.map(station => `
            <div class="station-card">
                <div class="station-header">
                    <h4>📍 ${station.name}</h4>
                    <div class="machine-actions">
                        <button class="icon-btn" onclick="editStation(${station.id})" title="Edit">✏️</button>
                        <button class="icon-btn delete" onclick="deleteStation(${station.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="employees-grid">
                    ${station.employees.map(emp => `
                        <div class="employee-item">
                            <div class="employee-name">
                                👤 ${emp.name}
                            </div>
                            <div class="employee-stats">
                                <span class="stat-label">Boxes Completed</span>
                                <span class="stat-value">${emp.boxes.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Add Station button
document.getElementById('addStationBtn')?.addEventListener('click', () => {
    currentStationId = null;
    document.getElementById('stationId').value = '';
    document.getElementById('stationName').value = '';
    document.getElementById('employeeCount').value = '1';
    updateEmployeeInputs();
    document.getElementById('stationModal').classList.add('active');
});

// Edit Station
function editStation(id) {
    const stations = getStations();
    const station = stations.find(s => s.id === id);
    
    if (station) {
        currentStationId = id;
        document.getElementById('stationId').value = id;
        document.getElementById('stationName').value = station.name;
        document.getElementById('employeeCount').value = station.employees.length;
        updateEmployeeInputs(station.employees);
        document.getElementById('stationModal').classList.add('active');
    }
}

// Delete Station
function deleteStation(id) {
    if (confirm('Are you sure you want to delete this station?')) {
        let stations = getStations();
        stations = stations.filter(s => s.id !== id);
        saveStations(stations);
        renderStations();
    }
}

// Update employee inputs based on count
document.getElementById('employeeCount')?.addEventListener('change', (e) => {
    updateEmployeeInputs();
});

function updateEmployeeInputs(existingEmployees = null) {
    const count = parseInt(document.getElementById('employeeCount').value);
    const container = document.getElementById('employeesContainer');
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const employee = existingEmployees && existingEmployees[i] 
            ? existingEmployees[i] 
            : { name: `Employee ${String.fromCharCode(65 + i)}`, boxes: 0 };
        
        const div = document.createElement('div');
        div.className = 'employee-input-group';
        div.innerHTML = `
            <label>Employee ${i + 1} Name</label>
            <input type="text" class="employee-name-input" value="${employee.name}" required>
            <label style="margin-top: 10px;">Boxes Completed (from AI)</label>
            <input type="number" class="employee-boxes-input" value="${employee.boxes}" min="0" readonly disabled>
        `;
        container.appendChild(div);
    }
}

// Save Station
document.getElementById('stationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('stationName').value;
    const employeeCount = parseInt(document.getElementById('employeeCount').value);
    
    const employees = [];
    const nameInputs = document.querySelectorAll('.employee-name-input');
    const boxesInputs = document.querySelectorAll('.employee-boxes-input');
    
    let stations = getStations();
    
    if (currentStationId) {
        // Update existing station - ONLY update names, keep box counts from AI
        const index = stations.findIndex(s => s.id === currentStationId);
        if (index !== -1) {
            const existingStation = stations[index];
            for (let i = 0; i < employeeCount; i++) {
                employees.push({
                    id: i + 1,
                    name: nameInputs[i].value,
                    // Keep existing box count from AI model
                    boxes: existingStation.employees[i] ? existingStation.employees[i].boxes : 0
                });
            }
            stations[index] = { id: currentStationId, name, employees };
        }
    } else {
        // Add new station - starts with 0 boxes, will be updated by AI
        for (let i = 0; i < employeeCount; i++) {
            employees.push({
                id: i + 1,
                name: nameInputs[i].value,
                boxes: 0 // Starts at 0, AI will update
            });
        }
        const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
        stations.push({ id: newId, name, employees });
    }
    
    saveStations(stations);
    renderStations();
    closeStationModal();
});

// Cancel Station Modal
document.getElementById('cancelStationBtn')?.addEventListener('click', closeStationModal);

function closeStationModal() {
    document.getElementById('stationModal').classList.remove('active');
    currentStationId = null;
}

// Close modal on outside click
document.getElementById('stationModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'stationModal') {
        closeStationModal();
    }
});

// Simulate real-time data updates (for demo purposes)
// This simulates the AI model sending updates
function simulateDataUpdates() {
    setInterval(() => {
        const machines = getMachines();
        if (machines.length > 0) {
            // Randomly update a machine's count
            const randomIndex = Math.floor(Math.random() * machines.length);
            machines[randomIndex].count += Math.floor(Math.random() * 5);
            saveMachines(machines);
            
            // Only re-render if on dashboard
            if (document.getElementById('dashboardPage').classList.contains('active')) {
                renderMachines();
            }
        }
        
        const stations = getStations();
        if (stations.length > 0) {
            // Randomly update an employee's box count
            const randomStationIndex = Math.floor(Math.random() * stations.length);
            const station = stations[randomStationIndex];
            if (station.employees.length > 0) {
                const randomEmpIndex = Math.floor(Math.random() * station.employees.length);
                station.employees[randomEmpIndex].boxes += Math.floor(Math.random() * 2);
                saveStations(stations);
                
                // Only re-render if on dashboard
                if (document.getElementById('dashboardPage').classList.contains('active')) {
                    renderStations();
                }
            }
        }
    }, 5000); // Update every 5 seconds
}

// ============================================
// STATISTICS FUNCTIONALITY
// ============================================

let currentPeriod = 'daily';
let productionChart = null;

// Generate statistics data
function generateStatsData(product, period) {
    const baseCount = Math.floor(Math.random() * 1000) + 500;
    const change = Math.floor(Math.random() * 30) - 10;
    const isPositive = change >= 0;
    
    let dataPoints = [];
    let labels = [];
    
    if (period === 'daily') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            dataPoints.push(baseCount + Math.floor(Math.random() * 200));
        }
    } else if (period === 'weekly') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            labels.push(`Week ${4 - i}`);
            dataPoints.push(baseCount * 7 + Math.floor(Math.random() * 1000));
        }
    } else if (period === 'monthly') {
        // Last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            labels.push(months[monthIndex]);
            dataPoints.push(baseCount * 30 + Math.floor(Math.random() * 5000));
        }
    }
    
    return {
        current: baseCount,
        change: change,
        isPositive: isPositive,
        dataPoints: dataPoints,
        labels: labels
    };
}

// Load statistics
function loadStatistics(period) {
    currentPeriod = period;
    
    // Update active tab
    document.querySelectorAll('.period-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.period === period) {
            tab.classList.add('active');
        }
    });
    
    // Get unique products
    const machines = getMachines();
    const products = [...new Set(machines.map(m => m.product))];
    
    // Generate stats cards
    const container = document.getElementById('productStatsContainer');
    container.innerHTML = products.map(product => {
        const stats = generateStatsData(product, period);
        return `
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-product-name">${product}</div>
                    <div class="stat-icon">📦</div>
                </div>
                <div class="stat-value">${stats.current.toLocaleString()}</div>
                <div class="stat-change ${stats.isPositive ? 'positive' : 'negative'}">
                    ${stats.isPositive ? '↑' : '↓'} ${Math.abs(stats.change)}% vs last ${period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'}
                </div>
            </div>
        `;
    }).join('');
    
    // Generate chart
    generateProductionChart(products, period);
}

// Generate production chart
function generateProductionChart(products, period) {
    const canvas = document.getElementById('productionChart');
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (productionChart) {
        productionChart.destroy();
    }
    
    // Generate datasets for each product
    const datasets = products.map((product, index) => {
        const stats = generateStatsData(product, period);
        const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
        ];
        
        return {
            label: product,
            data: stats.dataPoints,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace('0.8', '0.2'),
            tension: 0.4,
            fill: true
        };
    });
    
    // Get labels from first product
    const stats = generateStatsData(products[0], period);
    
    // Create chart
    productionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stats.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// Period tab click handlers
document.querySelectorAll('.period-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const period = tab.dataset.period;
        loadStatistics(period);
    });
});

// ============================================
// PRODUCTS MANAGEMENT FUNCTIONALITY
// ============================================

function loadProducts() {
    const machines = getMachines();
    const productTypes = getProductTypes();
    
    // Get all products (both saved and in use)
    const productsInUse = [...new Set(machines.map(m => m.product))];
    const allProductNames = [...new Set([
        ...productTypes.map(p => p.name),
        ...productsInUse
    ])].sort();
    
    const container = document.getElementById('productsList');
    
    if (allProductNames.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No Products Yet</h3>
                <p>Click "+ Add Product Type" to create your first product</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = allProductNames.map(productName => {
        const machineCount = machines.filter(m => m.product === productName).length;
        const totalCount = machines
            .filter(m => m.product === productName)
            .reduce((sum, m) => sum + m.count, 0);
        
        const inUse = machineCount > 0;
        const productType = productTypes.find(p => p.name === productName);
        
        return `
            <div class="product-type-card">
                <div class="product-type-info">
                    <div class="product-type-icon">📦</div>
                    <div class="product-type-details">
                        <h4>${productName}</h4>
                        <p class="product-type-meta">${machineCount} machines • ${totalCount.toLocaleString()} total units</p>
                        ${productType && productType.description ? `<p class="product-description">${productType.description}</p>` : ''}
                    </div>
                </div>
                <div class="product-type-actions">
                    ${!inUse ? `<button class="delete-product-btn" onclick="deleteProduct('${productName}')">🗑️ Delete</button>` : `<span class="in-use-badge">In Use</span>`}
                </div>
            </div>
        `;
    }).join('');
}

// Delete product
function deleteProduct(productName) {
    showConfirmDialog(
        'Delete Product Type',
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
        () => {
            let productTypes = getProductTypes();
            productTypes = productTypes.filter(p => p.name !== productName);
            saveProductTypes(productTypes);
            
            showToast(
                'Product Deleted',
                `"${productName}" has been removed from your product types.`
            );
            
            loadProducts();
        }
    );
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set icon and type
    if (type === 'error') {
        toastIcon.textContent = '✕';
        toast.classList.add('error');
    } else {
        toastIcon.textContent = '✓';
        toast.classList.remove('error');
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ============================================
// CONFIRMATION DIALOG
// ============================================

let confirmCallback = null;

function showConfirmDialog(title, message, onConfirm) {
    const dialog = document.getElementById('confirmDialog');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmCallback = onConfirm;
    
    dialog.classList.add('active');
}

function closeConfirmDialog() {
    document.getElementById('confirmDialog').classList.remove('active');
    confirmCallback = null;
}

// Confirm dialog buttons
document.getElementById('confirmCancel')?.addEventListener('click', closeConfirmDialog);

document.getElementById('confirmDelete')?.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmDialog();
});

// ============================================
// PRODUCT TYPES MANAGEMENT
// ============================================

// Get product types from storage
function getProductTypes() {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCT_TYPES);
    return stored ? JSON.parse(stored) : [];
}

// Save product types to storage
function saveProductTypes(productTypes) {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_TYPES, JSON.stringify(productTypes));
}

// Add Product Type button
document.getElementById('addProductTypeBtn')?.addEventListener('click', () => {
    document.getElementById('productTypeId').value = '';
    document.getElementById('productTypeName').value = '';
    document.getElementById('productTypeDescription').value = '';
    document.getElementById('productTypeModal').classList.add('active');
});

// Close Product Type Modal
function closeProductTypeModal() {
    document.getElementById('productTypeModal').classList.remove('active');
}

// Save Product Type
document.getElementById('productTypeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productName = document.getElementById('productTypeName').value.trim();
    const description = document.getElementById('productTypeDescription').value.trim();
    
    if (!productName) {
        showToast('Error', 'Please enter a product type name', 'error');
        return;
    }
    
    // Get existing product types
    let productTypes = getProductTypes();
    
    // Check if product already exists
    if (productTypes.some(p => p.name.toLowerCase() === productName.toLowerCase())) {
        showToast('Error', `Product type "${productName}" already exists!`, 'error');
        return;
    }
    
    // Add new product type
    const newProduct = {
        id: productTypes.length > 0 ? Math.max(...productTypes.map(p => p.id)) + 1 : 1,
        name: productName,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    productTypes.push(newProduct);
    saveProductTypes(productTypes);
    
    // Show success message
    showToast(
        'Product Type Added!',
        `"${productName}" is now available when adding machines.`
    );
    
    closeProductTypeModal();
    
    // Reload products page if we're on it
    if (document.getElementById('productsView').classList.contains('active')) {
        loadProducts();
    }
});

// Start simulating updates
simulateDataUpdates();
