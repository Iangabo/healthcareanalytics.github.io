document.addEventListener('DOMContentLoaded', function () {
    const avgMAVisitTimeInput = document.getElementById('avg-ma-visit-time');
    const avgWaitTimeInExamInput = document.getElementById('avg-wait-time-in-exam');
    const avgProviderVisitTimeInput = document.getElementById('avg-provider-visit-time');
    const totalVisitTimeDisplay = document.getElementById('total-visit-time');

    const avgVisitsPerYearInput = document.getElementById('avg-visits-per-year');
    const availableDaysPerYearInput = document.getElementById('available-days-per-year');
    const providerProductivityPerHourInput = document.getElementById('provider-productivity-per-hour');
    const availableTimePerDayInput = document.getElementById('available-time-per-day');
    const roomUtilizationTargetInput = document.getElementById('room-utilization-target');
    const productivityTargetPerDayDisplay = document.getElementById('productivity-target-per-day');
    const examRoomOccupancyDisplay = document.getElementById('exam-room-occupancy');
    
    const yearSelect = document.getElementById('year-select');

    const requiredProvidersDisplay = document.getElementById('required-providers');
    const requiredProvidersRoundedDisplay = document.getElementById('required-providers-rounded');
    const departmentProductivityTargetDisplay = document.getElementById('department-productivity-target');
    const requiredExamRoomsDisplay = document.getElementById('required-exam-rooms');
    const requiredExamRoomsPerProviderDisplay = document.getElementById('required-exam-rooms-per-provider');
    const visitsPerProviderPerYearDisplay = document.getElementById('visits-per-provider-per-year');

    const yearsData = {};

    const startYear = 2023;
    const endYear = 2043;
    let totalVisitTime = 0;

    // Initialize all inputs to 0
    avgMAVisitTimeInput.value = '0';
    avgWaitTimeInExamInput.value = '0';
    avgProviderVisitTimeInput.value = '0';
    availableDaysPerYearInput.value = '0';
    providerProductivityPerHourInput.value = '0';
    availableTimePerDayInput.value = '0';
    roomUtilizationTargetInput.value = '0';

    let currentAvgVisitsPerYear = 0;

    // Calculate initial values for each year
    for (let year = startYear; year <= endYear; year++) {
        if (year === startYear) {
            currentAvgVisitsPerYear = parseFloat(avgVisitsPerYearInput.value) || 0; 
        } else {
            currentAvgVisitsPerYear = Math.ceil(currentAvgVisitsPerYear * 1.02);
        }
        yearsData[year] = currentAvgVisitsPerYear;
    }

    // Fill in select options with available years
    Object.keys(yearsData).forEach(year => {
        let option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Function to update the total visit time
    function updateTotalVisitTime() {
        const avgMAVisitTime = parseFloat(avgMAVisitTimeInput.value) || 0;
        const avgWaitTimeInExam = parseFloat(avgWaitTimeInExamInput.value) || 0;
        const avgProviderVisitTime = parseFloat(avgProviderVisitTimeInput.value) || 0;
        totalVisitTime = avgMAVisitTime + avgWaitTimeInExam + avgProviderVisitTime;
        totalVisitTimeDisplay.textContent = totalVisitTime.toFixed(1);
    }

    // Function to update all calculations
    function updateCalculations(avgVisitsPerYear) {
        let availableDaysPerYear = parseFloat(availableDaysPerYearInput.value) || 0;
        let providerProductivityPerHour = parseFloat(providerProductivityPerHourInput.value) || 0;
        let availableTimePerDay = parseFloat(availableTimePerDayInput.value) || 0;
        let roomUtilizationTarget = parseFloat(roomUtilizationTargetInput.value) || 0;

        let providerProductivityPerDay = providerProductivityPerHour * availableTimePerDay;
        let productivityTargetPerDay = (avgVisitsPerYear / availableDaysPerYear).toFixed(1);
        let examRoomOccupancy = totalVisitTime !== 0 ? ((roomUtilizationTarget/100) * availableTimePerDay * 60) / totalVisitTime : 0;
        examRoomOccupancy = Math.floor(examRoomOccupancy); // Round down to the nearest multiple

        let requiredProviders = (avgVisitsPerYear / availableDaysPerYear) / providerProductivityPerDay;
        let requiredProvidersRounded = requiredProviders % 1 > 0.1 ? Math.ceil(requiredProviders) : Math.round(requiredProviders);
        let departmentProductivityTarget = (providerProductivityPerDay * requiredProvidersRounded).toFixed(1);
        let requiredExamRooms = Math.ceil(parseFloat(departmentProductivityTarget) / examRoomOccupancy);
        let requiredExamRoomsPerProvider = (requiredExamRooms / requiredProvidersRounded).toFixed(2);
        let visitsPerProviderPerYear = (avgVisitsPerYear / requiredProvidersRounded).toFixed(1);

        productivityTargetPerDayDisplay.textContent = productivityTargetPerDay;
        examRoomOccupancyDisplay.textContent = examRoomOccupancy.toString();
        requiredProvidersDisplay.textContent = requiredProviders.toFixed(2);
        requiredProvidersRoundedDisplay.textContent = requiredProvidersRounded.toString();
        departmentProductivityTargetDisplay.textContent = departmentProductivityTarget;
        requiredExamRoomsDisplay.textContent = requiredExamRooms.toString();
        requiredExamRoomsPerProviderDisplay.textContent = requiredExamRoomsPerProvider;
        visitsPerProviderPerYearDisplay.textContent = visitsPerProviderPerYear;

        // customized events with the new values
        const examRoomsEvent = new CustomEvent('examRoomsUpdate', { detail: requiredExamRooms });
        const providersEvent = new CustomEvent('providersUpdate', { detail: requiredProvidersRounded });
        document.dispatchEvent(examRoomsEvent);
        document.dispatchEvent(providersEvent);

        
    }

    // Event listeners for inputs related to total visit time
    avgMAVisitTimeInput.addEventListener('input', updateTotalVisitTime);
    avgWaitTimeInExamInput.addEventListener('input', updateTotalVisitTime);
    avgProviderVisitTimeInput.addEventListener('input', updateTotalVisitTime);

    // Event listeners for calculation-related inputs
    availableDaysPerYearInput.addEventListener('input', function () {
        updateCalculations(parseFloat(avgVisitsPerYearInput.value) || 0);
    });

    providerProductivityPerHourInput.addEventListener('input', function () {
        updateCalculations(parseFloat(avgVisitsPerYearInput.value) || 0);
    });

    availableTimePerDayInput.addEventListener('input', function () {
        updateCalculations(parseFloat(avgVisitsPerYearInput.value) || 0);
    });

    roomUtilizationTargetInput.addEventListener('input', function () {
        updateCalculations(parseFloat(avgVisitsPerYearInput.value) || 0);
    });

    // Change selected year
    yearSelect.addEventListener('change', function () {
        const selectedYear = yearSelect.value;
        if (selectedYear in yearsData) {
            currentAvgVisitsPerYear = yearsData[selectedYear];
            avgVisitsPerYearInput.value = currentAvgVisitsPerYear.toString();
            updateCalculations(currentAvgVisitsPerYear);
        }
    });

    // Event listeners for information icons
    document.querySelectorAll('.info-icon').forEach((icon) => {
        icon.addEventListener('mouseenter', function () {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                const tooltipElement = document.createElement('div');
                tooltipElement.className = 'tooltip';
                tooltipElement.textContent = tooltipText;
                this.appendChild(tooltipElement);
            }
        });

        icon.addEventListener('mouseleave', function () {
            const tooltipElement = this.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    });

    // Initialize with initial year and corresponding calculations
    yearSelect.value = startYear.toString();
    updateCalculations(currentAvgVisitsPerYear);

    function updateLegend() {
        const legendList = document.getElementById('legend-list');
        legendList.innerHTML = ''; // Clear the current legend
    
        // Create entries for each type of cube
        const legendEntries = [
            { type: 'exam', color: '#ae0001', label: 'Exam Room (ER)' },
            { type: 'provider', color: '#eeba30', label: 'Provider (P)' }
        ];
    
        legendEntries.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.className = 'flex items-center mb-2';
    
            const colorBox = document.createElement('span');
            colorBox.className = 'w-4 h-4 inline-block mr-2';
            colorBox.style.backgroundColor = entry.color;
            colorBox.style.border = '1px solid #000'; // Edge for better visibility
    
            const label = document.createElement('span');
            label.textContent = entry.label;
            label.className = 'text-lg';
    
            listItem.appendChild(colorBox);
            listItem.appendChild(label);
            legendList.appendChild(listItem);
        });
    }
    
    // Call the function to initialize the legend
    updateLegend();
    
});
