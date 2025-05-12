// Data storage for visitor records
let visitorData = [];

// Chart objects
let barChart, pieChart, lineChart;

// DOM Elements
const visitorForm = document.getElementById('visitor-form');
const monthSelect = document.getElementById('month');
const visitorsInput = document.getElementById('visitors');
const dataTable = document.getElementById('data-table').querySelector('tbody');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Form submission handler
    visitorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addVisitorRecord();
    });
});

// Initialize all charts
function initializeCharts() {
    // Bar Chart
    const barCtx = document.getElementById('bar-chart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Visitantes por Mes',
                data: [],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Visitantes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            }
        }
    });
    
    // Pie Chart
    const pieCtx = document.getElementById('pie-chart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(230, 126, 34, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(52, 73, 94, 0.7)',
                    'rgba(26, 188, 156, 0.7)',
                    'rgba(41, 128, 185, 0.7)',
                    'rgba(243, 156, 18, 0.7)',
                    'rgba(192, 57, 43, 0.7)',
                    'rgba(22, 160, 133, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(230, 126, 34, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(52, 73, 94, 1)',
                    'rgba(26, 188, 156, 1)',
                    'rgba(41, 128, 185, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(192, 57, 43, 1)',
                    'rgba(22, 160, 133, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Distribución de Visitantes'
                }
            }
        }
    });
    
    // Line Chart
    const lineCtx = document.getElementById('line-chart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tendencia de Visitantes',
                data: [],
                fill: false,
                borderColor: 'rgba(52, 152, 219, 1)',
                tension: 0.1,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Visitantes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            }
        }
    });
}

// Add a new visitor record
function addVisitorRecord() {
    const month = monthSelect.value;
    const visitors = parseInt(visitorsInput.value);
    
    if (!month || isNaN(visitors)) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }
    
    // Check if month already exists
    const existingIndex = visitorData.findIndex(item => item.month === month);
    
    if (existingIndex !== -1) {
        // Update existing record
        visitorData[existingIndex].visitors = visitors;
    } else {
        // Add new record
        visitorData.push({ month, visitors });
        
        // Sort data by month order
        visitorData.sort((a, b) => {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return months.indexOf(a.month) - months.indexOf(b.month);
        });
    }
    
    // Update UI
    updateCharts();
    updateTable();
    
    // Reset form
    visitorForm.reset();
}

// Update all charts with current data
function updateCharts() {
    // Prepare data for charts
    const labels = visitorData.map(item => item.month);
    const values = visitorData.map(item => item.visitors);
    
    // Update Bar Chart
    barChart.data.labels = labels;
    barChart.data.datasets[0].data = values;
    barChart.update();
    
    // Update Pie Chart
    pieChart.data.labels = labels;
    pieChart.data.datasets[0].data = values;
    pieChart.update();
    
    // Update Line Chart
    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = values;
    lineChart.update();
}

// Update the data table
function updateTable() {
    // Clear existing rows
    dataTable.innerHTML = '';
    
    // Add rows for each data point
    visitorData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Month cell
        const monthCell = document.createElement('td');
        monthCell.textContent = item.month;
        row.appendChild(monthCell);
        
        // Visitors cell
        const visitorsCell = document.createElement('td');
        visitorsCell.textContent = item.visitors;
        row.appendChild(visitorsCell);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteRecord(index));
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        dataTable.appendChild(row);
    });
}

// Delete a record
function deleteRecord(index) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        visitorData.splice(index, 1);
        updateCharts();
        updateTable();
    }
} 