(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else{
                    generate();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function addMonths(date, months) {
    var target_month = date.getMonth() + months;
    var year = date.getFullYear() + parseInt(target_month / 12);
    var month = target_month % 12;
    var day = date.getDate();
    var last_day = daysInMonth(year, month);
    if (day > last_day) {
        day = last_day;
    }
    var new_date = new Date(year, month, day);
    return new_date;
}

function generateHTML(rent, startdate, receiptNo, houseAddress, tenantName, ownerName, ownerPAN) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    html =
    `
    <div class="card mb-3">
        <div class="card-header">
            <h2>RENT RECEIPT <small>` + months[startdate.getMonth()] + ' ' + startdate.getFullYear() + `</small></h2>
        </div>
        <div class="card-body">
            Generated on cleartax (cleartax.in/save/rent)
            <h5 class="card-title">date: <b>` + startdate.getDate() + ' ' + months[startdate.getMonth()] + ' ' + startdate.getFullYear() + `</b></h5>
            <p class="card-text">Received sum of INR Rs. <b>` + rent + `</b> from <b>` + tenantName
            + `</b> towards the property located at  <b>` + houseAddress + `</b> for the period of date to enddate.
        </div>
        <div class="card-footer text-muted">
            `+ ownerName + ` (landlord)
            <br>
            PAN: ` + ownerPAN + `
        </div>
    </div>
`
    return html;
}

function generate() {
    form = document.receiptForm;
    rent = form.monthlyRent.value;
    occupancyStart = new Date(form.occupancyStart.value);
    occupancyEnd = new Date(form.occupancyEnd.value);
    houseAddress = form.houseAddress.value;
    tenantName = form.tenantName.value;
    ownerName = form.ownerName.value;
    ownerPAN = form.ownerPAN.value;

    duration = occupancyEnd - occupancyStart;

    if (occupancyStart > occupancyEnd) {
        alert("The occupancy start date can not be greater than end date.");
        return false;
    }
    
    //Calculate the financial year. April is 3, May is 4.
    financialYearStart = new Date(occupancyStart.getFullYear(), 3, 1);
    financialYearEnd = new Date(occupancyStart.getFullYear() + 1, 4, 31);
    
    if (occupancyStart < financialYearStart || occupancyEnd > financialYearEnd){ //check if its not inside financial year range
        if (occupancyStart <= financialYearEnd && occupancyEnd >= financialYearStart){ //check if its overlapping
            alert("Please select dates in one financial year only.");
            return false;
        }
    }

    receiptList = "";
    startdate = occupancyStart;
    receiptNo = 1;

    while (startdate < occupancyEnd) {
        enddate = addMonths(startdate, 1);
        receiptList = receiptList + generateHTML(rent, startdate, receiptNo, houseAddress, tenantName, ownerName, ownerPAN);
        startdate = enddate;
    }

    var content = document.getElementById("main");
    content.innerHTML = receiptList;
}
